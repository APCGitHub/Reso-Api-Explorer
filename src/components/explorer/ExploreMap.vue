<template>
    <div id="map"></div>
</template>

<script type="text/babel">
    import GoogleMapService from '../../services/GoogleMaps';
    import MarkerService from '../../services/MarkerService';
    import ShortId from 'shortid';

    export default {
        googleMapService: null,
        markerService: null,
        props: ['listings', 'expanded'],
        data() {
            return {
                map: {
                    selected_shape: null,
                    expanded: this.expanded,
                    center: {},
                    instance: null,
                    drawing_manager: null,
                    shape_props: {
                        fillColor: '#ec6952',
                        fillOpacity: 0.5,
                        editable: true,
                        draggable: true,
                        strokeWeight: 3,
                        geodesic: true
                    },
                    info_window: null,
                },
                shapes: {
                    circles: [],
                    rectangles: [],
                    polygons: []
                }//
            }
        },
        mounted() {
            this.googleMapService = new GoogleMapService(document.getElementById('map'), {
                center: {
                    lat: 39.9612,
                    lng: -82.9988
                },
                zoom: 10
            });

            this.googleMapService.load((map, google) => {
                this.map.instance = map;
                this.map.center = this.map.instance.getCenter();
                this.markerService = new MarkerService(this.map.instance);

                /**
                 * Custom method to get the bounding box for a polygon in lat/lng format
                 * @returns {google.maps.LatLngBounds}
                 */
                google.maps.Polygon.prototype.my_getBounds = function() {
                    var bounds = new google.maps.LatLngBounds();

                    this.getPath().forEach((element,index) => {
                        bounds.extend(element)
                    });

                    return bounds;
                }

                /**
                 * Set up the drawing manager
                 * @type {google.maps.drawing.DrawingManager}
                 */
                this.map.drawing_manager = new google.maps.drawing.DrawingManager({
                    drawingMode: null,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: ['circle', 'polygon', 'rectangle']
                    },
                    polygonOptions: this.map.shape_props,
                    circleOptions: this.map.shape_props,
                    rectangleOptions: this.map.shape_props
                });

                //Bind shape events
                setTimeout(() => {
                    this.map.drawing_manager.setMap(this.map.instance);

                    this.bindEvents();
                }, 500);
            });
        },
        methods: {
            /**
             * Handle setting up all the map related events and what not
             */
            bindEvents() {
                //Set up the info window
                this.shapesWindow();

                //When a shape is done switch back to hand mode
                google.maps.event.addListener(this.map.drawing_manager, 'overlaycomplete', (e) => {
                    this.map.drawing_manager.setDrawingMode(null);
                });

                /**
                 * Circle was just created
                 */
                google.maps.event.addListener(this.map.drawing_manager, 'circlecomplete', (circle) => {
                    console.log('circle complete');
                    circle.type = 'circle';
                    circle.id = ShortId.generate();

                    //Handle click
                    google.maps.event.addListener(circle, 'click', (e) => {
                        this.map.selected_shape = circle;
                        this.map.info_window.open(this.map.instance);
                        this.map.info_window.setPosition(circle.getCenter());
                    });

//                    google.maps.event.addListener(circle, 'radius_changed', () => {
//                        let r = circle.getRadius();
//                    });
//
//                    google.maps.event.addListener(circle, 'center_changed', () => {
//                        let point = circle.getCenter();
//                    });

                    this.shapes.circles.push(circle);

                    this.emitShapesToParent();
                });

                /**
                 * Rectangle was just created
                 */
                google.maps.event.addListener(this.map.drawing_manager, 'rectanglecomplete', (rectangle) => {
                    rectangle.type = 'rectangle';
                    rectangle.id = ShortId.generate();

                    //Handle click
                    google.maps.event.addListener(rectangle, 'click', (e) => {
                        this.map.selected_shape = rectangle;
                        this.map.info_window.open(this.map.instance);
                        this.map.info_window.setPosition(rectangle.getBounds().getCenter());
                    });

                    this.shapes.rectangles.push(rectangle);

                    this.emitShapesToParent();
                });

                /**
                 * Polygon was just created
                 */
                google.maps.event.addListener(this.map.drawing_manager, 'polygoncomplete', (polygon) => {
                    polygon.type = 'polygon';
                    polygon.id = ShortId.generate();

                    //Handle click
                    google.maps.event.addListener(polygon, 'click', (e) => {
                        this.map.selected_shape = polygon;
                        this.map.info_window.open(this.map.instance);
                        this.map.info_window.setPosition(polygon.my_getBounds().getCenter());
                    });

                    this.shapes.polygons.push(polygon);

                    this.emitShapesToParent();
                });
            },
            /**
             * Set up the shapes info window
             *
             * TODO: Add more data to the window
             */
            shapesWindow() {
                this.map.info_window = new google.maps.InfoWindow();

                let content = `<button id="shape-button" class="waves-effect waves-light btn">Remove</button>`;

                this.map.info_window.setContent(content);

                //When info window dom loaded
                google.maps.event.addListener(this.map.info_window, 'domready', () => {

                    //Attach event to the button to remove the selected shape
                    google.maps.event.addDomListener(document.getElementById('shape-button'), 'click', () => {
                        let array = null;

                        switch(this.map.selected_shape.type){
                            case 'circle':
                                array = 'circles';
                                break;

                            case 'rectangle':
                                array = 'rectangles';
                                break;

                            case 'polygon':
                                array = 'polygons';
                                break;
                        }
                        //Handle removing locally
                        if(array && this.shapes[array]){
                            for(let i = 0; i < this.shapes[array].length; i++){
                                console.log(this.shapes[array]);
                                if(this.shapes[array][i].id === this.map.selected_shape.id){
                                    this.shapes[array].splice(i, 1);
                                }
                            }
                        }

                        //Remove from map
                        this.map.selected_shape.setMap(null);

                        //Close the info window
                        this.map.info_window.close();

                        //Tell the parent about the update
                        this.emitShapesToParent();
                    });
                });
            },
            /**
             * Tell the parent that the shapes have changed
             */
            emitShapesToParent(){
                this.$emit('shapesChanged', this.shapes);
            }
        },
        watch: {
            listings(val, oldVal) {
                if(val){
                    this.markerService.plotMarkers(val);
                }
            },
            expanded(val, oldVal){
                this.map.center = this.map.instance.getCenter();

                setTimeout(() => {
                    google.maps.event.trigger(this.map.instance, 'resize');

                    this.map.instance.setCenter(this.map.center);

                    this.$emit('mapResized');
                }, 300);
            }
        }
    }
</script>
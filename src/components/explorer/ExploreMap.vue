<template>
    <div id="map"></div>
</template>

<script type="text/babel">
    import GoogleMapService from '../../services/GoogleMaps';
    import MarkerService from '../../services/MarkerService';

    export default {
        googleMapService: null,
        markerService: null,
        props: ['listings', 'expanded'],
        data() {
            return {
                map: {
                    selected_shap: null,
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
                }
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

            //Load the map
            this.googleMapService.load((map) => {
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
                    drawingMode: google.maps.drawing.OverlayType.MARKER,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: ['circle', 'polygon', 'rectangle']
                    },
                    polygonOptions: this.map.shape_props,
                    circleOptions: this.map.shape_props,
                    rectangleOptions: this.map.shape_props
                });

                //Load the drawing manager and bind shape events
                setTimeout(() => {
                    this.map.drawing_manager.setMap(this.map.instance);

                    this.bindEvents();
                }, 500);
            });
        },
        methods: {
            bindEvents() {
                //Set up the info window
                this.shapesWindow();

                /**
                 * Circle was just created
                 */
                google.maps.event.addListener(this.map.drawing_manager, 'circlecomplete', (circle) => {
                    google.maps.event.addListener(circle, 'click', (e) => {
                        this.map.selected_shape = circle;
                        this.map.info_window.open(this.map.instance);
                        this.map.info_window.setPosition(circle.getCenter());
                    });

                    google.maps.event.addListener(circle, 'radius_changed', () => {
                        let r = circle.getRadius();
                    });

                    google.maps.event.addListener(circle, 'center_changed', () => {
                        let point = circle.getCenter();
                    });
                });

                /**
                 * Rectangle was just created
                 */
                google.maps.event.addListener(this.map.drawing_manager, 'rectanglecomplete', (rectangle) => {
                    google.maps.event.addListener(rectangle, 'click', (e) => {
                        this.map.selected_shape = rectangle;
                        this.map.info_window.open(this.map.instance);
                        this.map.info_window.setPosition(rectangle.getBounds().getCenter());
                    });
                });

                /**
                 * Polygon was just created
                 */
                google.maps.event.addListener(this.map.drawing_manager, 'polygoncomplete', (polygon) => {
                    google.maps.event.addListener(polygon, 'click', (e) => {
                        this.map.selected_shape = polygon;
                        this.map.info_window.open(this.map.instance);
                        this.map.info_window.setPosition(polygon.my_getBounds().getCenter());
                    });
                });
            },
            shapesWindow() {
                this.map.info_window = new google.maps.InfoWindow();

                let content = `<button id="shape-button" class="waves-effect waves-light btn">Remove</button>`;

                this.map.info_window.setContent(content);

                google.maps.event.addListener(this.map.info_window, 'domready', () => {
                    google.maps.event.addDomListener(document.getElementById('shape-button'), 'click', () => {
                        this.map.selected_shape.setMap(null);
                        this.map.info_window.close();
                    });
                });
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
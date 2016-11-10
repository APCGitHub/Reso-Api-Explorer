<template>
    <div id="map"></div>
</template>

<script type="text/babel">
    import GoogleMapService from '../../services/GoogleMaps';
    import MarkerService from '../../services/MarkerService';

    export default {
        googleMapService: null,
        markerService: null,
        props: [],
        data() {
            return {
                map: {
                    center: {},
                    instance: null,
                    drawing_manager: null
                }
            }
        },
        created() {
            //Set up google map service
            this.googleMapService = new GoogleMapService(document.getElementById('map'), {
                center: {
                    lat: 39.9612,
                    lng: -82.9988
                },
                zoom: 10
            });

            //Set up the drawing manater
            this.map.drawing_manager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.MARKER,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: ['circle', 'polygon', 'rectangle']
                },
            });

            //Load the map
            this.googleMapService.load((map) => {
                this.map.instance = map;
                this.markerService = new MarkerService(this.map.instance);
                this.map.drawing_manager.setMap(this.map.instance);
            });
        }
    }
</script>
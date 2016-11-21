/**
 * Created by aclinton on 11/7/16.
 */
import GoogleMaps from 'google-maps'

export default class MarkerService {
    constructor(map){
        this.map = map;
        this.info_window = new google.maps.InfoWindow({
            content: ''
        });
        this.markers = [];
    }

    plotMarkers(listings){
        let bounds = new google.maps.LatLngBounds();

        this.clearMarkers();

        for(let i = 0, len = listings.length; i < len; i++){
            let lat = 0, lng = 0, l = listings[i];

            if(l.listing.lat && l.listing.long){
                lat = l.listing.lat;
                lng = l.listing.long
            } else if (l.Latitude && l.Longitude){
                lat = l.Latitude;
                lng = l.Longitude;
            }

            if(lat && lng){
                let pos = new google.maps.LatLng(lat, lng);
                let m = new google.maps.Marker({
                    position: pos,
                    map: this.map,
                    animation: google.maps.Animation.DROP
                });

                this.setInfoWindow(m);

                this.markers.push(m);

                bounds.extend(pos)
            }
        }

        this.map.fitBounds(bounds);
    }

    clearMarkers () {
        for(let i = 0, len = this.markers.length; i < len; i++){
            this.markers[i].setMap(null);
        }
    }

    setInfoWindow(marker) {
        let self = this;
        google.maps.event.addListener(marker, 'click', function () {
            let content = `
                <div>
                    <p><b>Lat:</b> ${this.position.lat().toFixed(5)}</p>
                    <p><b>Lng:</b> ${this.position.lng().toFixed(5)}</p>
                </div>
            `;
            self.info_window.setContent(content);
            self.info_window.open(self.map, this);
        });
    }
}
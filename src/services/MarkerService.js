/**
 * Created by aclinton on 11/7/16.
 */
import _ from 'lodash';

export default class MarkerService {
    constructor(map){
        this.map = map;
        this.markers = [];
    }

    plotMarkers(listings){
        if(!listings || !listings.length)
            return;

        //Clear old markers
        this.clearMarkers();

        //New bounds
        let bounds = new google.maps.LatLngBounds();

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

                this.markers.push(m);

                bounds.extend(pos)
            }
        }

        this.map.fitBounds(bounds);
    }

    clearMarkers() {
        _.forEach(this.markers, (m) => {
            m.setMap(null);
        });

        this.markers = [];
    }
}
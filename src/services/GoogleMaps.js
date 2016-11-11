/**
 * Created by aclinton on 10/21/16.
 */
import GoogleMaps from 'google-maps'

export default class GoogleMapsService {
    constructor(el = '', map_options = {}) {
        if(el){
            this.el = el;
        }

        if(map_options){
            this.options = map_options;
        }

        this.map = null;

        this.loaded = false;
    }

    static init() {
        GoogleMaps.LIBRARIES = ['geometry', 'drawing'];

        GoogleMaps.KEY = 'AIzaSyAAVbYD7I7G9WBR1vibPL1jNPq5l9kE5cM';
    }

    load(cb) {
        if(!this.loaded){
            this.loaded = true;

            GoogleMaps.load(google => {
                this.map = new google.maps.Map(this.el, this.options);
                cb(this.map, google);
            });
        }
    }
}

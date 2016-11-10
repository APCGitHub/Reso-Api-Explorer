/**
 * Created by aclinton on 11/10/16.
 */

export default class FlashService {
    constructor(){}

    static flash(type, message, duration) {
        if(!duration){
            duration = 3000;
        }

        Materialize.toast(message, duration, type);
    }
}

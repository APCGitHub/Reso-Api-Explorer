/**
 * Created by aclinton on 11/2/16.
 */
import shortId from 'shortid';

export default class Server {
    constructor(data) {
        this.id = shortId.generate();
        this.redirect_uri = 'http://127.0.0.1:8321/#/explore/' + this.id;

        for(let key in data){
            if(Server.fillable.indexOf(key) > -1){
                this[key] = data[key];
            }
        }
    }

    static get fillable() {
        return [
            'name',
            'client_id',
            'access_token',
            'auth_endpoint',
            'token_endpoint'
        ];
    }

    static get hidden() {
        return [];
    }

    static create(data) {
        return new Server(data);
    }
}

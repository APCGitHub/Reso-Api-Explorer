/**
 * Created by aclinton on 11/2/16.
 */
import shortId from 'shortid';
import config from '../config/env';

export default class Server {
    constructor(data) {
        this.id = shortId.generate();
        this.redirect_uri = config.APP_URL + '#/explore/' + this.id;

        //Initialize
        for(let i = 0; i < Server.fillable.length; i++){
            this[Server.fillable[i]] = '';
        }

        //Fill in any that caller says to
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
            'client_secret',
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

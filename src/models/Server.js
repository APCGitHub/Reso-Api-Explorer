/**
 * Created by aclinton on 11/2/16.
 */
import shortId from 'shortid';

export default class Server {
    constructor(data) {
        this.name = data.name ? data.name : '';
        this.client_id = data.client_id ? data.client_id : '';
        this.access_token = '';
        this.auth_endpoint = data.auth_endpoint ? data.auth_endpoint : '';
        this.token_endpoint = data.token_endpoint ? data.token_endpoint: '';
        this.id = shortId.generate();

        this.redirect_uri = 'http://127.0.0.1:8321/#/explore/' + this.id;
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

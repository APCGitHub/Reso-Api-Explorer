/**
 * Created by aclinton on 11/2/16.
 */
import Vue from 'vue';
import Promise from 'es6-promise';
import Moment from 'moment';

export default class AccessTokenService {
    constructor(server){
        this.server = server;
    }

    getToken(client_secret, code) {
        let url = this.server.token_endpoint;

        return new Promise((resolve, reject) => {
            Vue.http.post(url, {
                client_id: this.server.client_id,
                client_secret: client_secret,
                redirect_uri: this.server.redirect_uri,
                code: code,
                grant_type: 'authorization_code'
            }).then((res) => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    }

    static setExpiresAt(expires) {
        let now = Moment();
        now.add('seconds', expires);

        return now;
    }
}

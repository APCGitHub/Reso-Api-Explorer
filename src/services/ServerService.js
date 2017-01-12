/**
 * Created by aclinton on 11/2/16.
 */
import Server from '../models/Server';
import Promise from 'bluebird';
import Config from '../config/env';

export default class ServerService {
    constructor(){
        if(localStorage.getItem(this.key) === null){
            localStorage.setItem(this.key, JSON.stringify([]));
        }
    }

    createDefaultServers() {
        let servers = Config.servers;

        return new Promise((resolve, reject) => {
            Server.batchCreate(servers).then(() => {
                resolve();
            });
        });
    }

    updateDefaultServers() {
        let servers = Config.servers;

        return new Promise((resolve, reject) => {
            Server.batchUpdate(servers).then(() => {
                resolve();
            });
        });
    }

    static openIdConnectUrl(server = {}) {
        let url = server.auth_endpoint;
        let params = [];

        if(server.config && server.config.openid){
            for(let i = 0; i < server.config.openid.length; i++){
                let _c = server.config.openid[i];
                let o = {
                    key: _c.key,
                    value: _c.value
                };

                if(_c._key && _c._key === 'redirect_uri'){
                    o.value = server.redirect_uri;

                    if(_c.encode)
                        o.value = encodeURIComponent(server.redirect_uri);
                }

                params.push(o);
            }
        }

        if(params.length){
            params = params.map((p) => {
                return `${p.key}=${p.value}`;
            });
        }

        params.push("response_type=code");

        url += "?" + params.join('&');

        return url;
    }
}

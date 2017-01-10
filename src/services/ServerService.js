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
                params.push({
                    key: server.config.openid[i].key,
                    value: server.config.openid[i].value
                });
            }
        }

        if(params.length){
            params = params.map((p) => {
                return `${p.key}=${p.value}`;
            });
        }

        url += "?" + params.join('&');

        return url;
    }
}

/**
 * Created by aclinton on 11/2/16.
 */
import Server from '../models/Server';
import Promise from 'es6-promise';
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
}

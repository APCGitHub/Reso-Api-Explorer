/**
 * Created by aclinton on 11/2/16.
 */
import Server from '../models/Server';
import Promise from 'es6-promise';

export default class ServerService {
    constructor(){
        this.key = 'servers';

        if(localStorage.getItem(this.key) === null){
            localStorage.setItem(this.key, JSON.stringify([]));
        }
    }

    index() {
        return new Promise((resolve, reject) => {
            let servers = localStorage.getItem(this.key);

            if(servers === null)
                return [];

            servers = JSON.parse(servers);

            resolve(servers);
        });
    }

    store(data){
        let server = Server.create(data);

        return new Promise((resolve, reject) => {
            this.index().then((servers) => {
                servers.push(server);

                localStorage.setItem(this.key, JSON.stringify(servers));

                resolve(server);
            });
        });
    }

    show(id) {
        return new Promise((resolve, reject) => {
            this.index().then((servers) => {
                let found = false;
                for(let i = 0, len = servers.length; i < len; i++){
                    if(servers[i].id === id){
                        found = true;
                        resolve(servers[i]);
                        break;
                    }
                }

                if(!found){
                    reject(null);
                }
            });
        });
    }

    update(id, data){
        return new Promise((resolve, reject) => {
            this.index().then((servers) => {
                let found = false;

                for(let i = 0; i < servers.length; i++){
                    let server = servers[i];

                    if(server.id === id){
                        found = true;

                        for(let field in data){
                            if(Server.fillable.indexOf(field) > -1){
                                server[field] = data[field];
                            }
                        }

                        servers[i] = server;

                        localStorage.setItem(this.key, JSON.stringify(servers));

                        resolve(server);

                        break;
                    }
                }

                if(!found)
                    reject();
            });
        });
    }

    destroy(id){
        return new Promise((resolve, reject) => {
            this.index().then((servers) => {
                let found = false;

                for(let i = 0; i < servers.length; i++){
                    if(servers[i].id === id){
                        found = true;
                        servers.splice(i, 1);
                        localStorage.setItem(this.key, JSON.stringify(servers));

                        resolve();
                    }
                }

                if(!found)
                    reject();
            });
        });
    }
}

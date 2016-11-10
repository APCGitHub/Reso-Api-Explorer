/**
 * Created by aclinton on 11/2/16.
 */
import shortId from 'shortid';
import config from '../config/env';
import Promise from 'es6-promise';

export default class Server {
    constructor(data) {
        /**
         * We might wanna move this logic to a static constructor maybe...
         * This is to allow inflation of Server class objects from raw data
         */
        if(data.id)
            this.id = data.id;
        else
            this.id = shortId.generate();

        //Make sure the redirect_uri is built properly
        let _url = config.ENV.APP_URL;

        if(_url.substring(_url.length - 1) !== '/')
            _url += '/';

        this.redirect_uri = _url + '#/explore/' + this.id;

        //Initialize to empty
        for(let i = 0; i < Server.fillable.length; i++){
            this[Server.fillable[i]] = '';
        }

        //Fill in any that caller says to
        for(let key in data){
            if(~Server.fillable.indexOf(key)){
                this[key] = data[key];
            }
        }
    }

    /**
     * Save {this} record into local storage.
     *
     * @returns {*}
     */
    save() {
        return new Promise((resolve, reject) => {
            Server.all().then(servers => {
                let found = false;
                //Find this server in the list and update it
                for(let i = 0, len = servers.length; i < len; i++){
                    if(servers[i].id === this.id){
                        servers[i] = this;
                        found = true;
                        break;
                    }
                }

                if(!found)
                    servers.push(this);

                //Save everything
                localStorage.setItem(Server.key, JSON.stringify(servers));

                //Assumes we will always find and save
                resolve(this);
            });
        });
    }

    /**
     * Update this and then call {save} to save it into the datastore
     *
     * @param data
     * @returns {*}
     */
    update(data) {
        for(let key in data){
            if(~Server.fillable.indexOf(key)){
                this[key] = data[key];
            }
        }

        return this.save();
    }

    /**
     * Delete a server
     * @returns {*}
     */
    destroy() {
        return new Promise((resolve, reject) => {
            Server.all().then(servers => {
                let found = false;

                for(let i = 0; i < servers.length; i++){
                    if(servers[i].id === this.id){
                        //Remove it
                        servers.splice(i, 1);
                        localStorage.setItem(Server.key, JSON.stringify(servers));

                        resolve();
                        found = true;
                        break;
                    }
                }

                if(!found)
                    reject();
            });
        });
    }

    /**
     * Fillable fields
     * @returns {string[]}
     */
    static get fillable() {
        return [
            'name',
            'client_id',
            'client_secret',
            'access_token',
            'data_endpoint',
            'auth_endpoint',
            'token_endpoint'
        ];
    }

    /**
     * return hidden columns
     * @returns {Array}
     */
    static get hidden() {
        return [];
    }

    /**
     * Simulate table name
     * @returns {string}
     */
    static get key() {
        return 'servers';
    }

    /**
     * Create a new server record
     * @param data
     * @returns {Server}
     */
    static create(data) {
        let server = new Server(data);

        return new Promise((resolve, reject) => {
            server.save().then(() => {
                resolve(server);
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Since we don't have a concept of transactions with localStorage
     * we manually play with the datastore here and insert manually
     *
     * @param servers
     * @returns {*}
     */
    static batchCreate(servers) {
        let _servers = [];

        for(let i = 0; i < servers.length; i++){
            let s = new Server(servers[i]);

            _servers.push(s);
        }


        return new Promise((resolve, reject) => {
            Server.all().then(servers => {
                servers = servers.concat(_servers);

                localStorage.setItem(Server.key, JSON.stringify(servers));

                resolve();
            });
        });
    }

    static batchUpdate(servers) {
        return new Promise((resolve, reject) => {
            let _servers = localStorage.getItem(Server.key) || [];

            if(typeof _servers === 'string')
                _servers = JSON.parse(_servers);

            //Loop through datastore servers
            for(let i = 0; i < _servers.length; i++) {
                let store_server = _servers[i];

                //Loop through updating servers
                for(let j = 0; j < servers.length; j++){
                    let found = false;

                    if(servers[j].id === store_server.id) {
                        found = true;

                        //Update fields
                        for (let k = 0; k < Server.fillable.length; k++) {
                            let key = Server.fillable[k];

                            store_server[key] = servers[j][key];
                        }
                    }

                    if(found){
                        _servers[i] = store_server;
                        localStorage.setItem(Server.key, JSON.stringify(_servers));
                        break;
                    }
                }
            }

            resolve();
        });
    }

    /**
     * Fetch all servers.
     *
     * @returns {*}
     */
    static all() {
        return new Promise((resolve, reject) => {
            let servers = localStorage.getItem(Server.key);

            if(servers === null){
                servers = [];
            } else {
                servers = JSON.parse(servers);
            }

            let server_classes = [];

            for(let i = 0; i < servers.length; i++){
                server_classes.push(new Server(servers[i]));
            }

            resolve(server_classes);
        });
    }

    /**
     * Find a single server with id {id}
     * @param id
     * @returns {*}
     */
    static find(id) {
        return new Promise((resolve, reject) => {
            Server.all().then((servers) => {
                let server = null;
                for(let i = 0, len = servers.length; i < len; i++){
                    server = servers[i];

                    if(server.id === id){
                        break;
                    }
                }

                if(server) {
                    //Note: we have to do this so that the server has the
                    //datestore methods attached to it like save/update
                    let s = new Server(server);
                    resolve(s);
                } else {
                    reject('Could not find the server');
                }
            }) ;
        });
    }
}

<template>
    <div class="row">
        <div class="col s12">
            <div class="section">
                <div class="row mb0">
                    <div class="col s6 offset-s3">
                        <h4 class="center-align mb0">Your Servers</h4>
                        <p class="center-align mb0" v-show="servers.length < 1">You currently haven't created any servers. Click the "+" below to get started.</p>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="row">
                    <div class="col s12">
                        <div class="row server-list" v-show="servers.length">
                            <div class="col s6" v-for="server of servers">
                                <div class="card server">
                                    <div class="card-content">
                                        <span class="card-title">{{server.name}}</span>
                                        <p><span class="grey-text">Client ID:</span> {{server.client_id}}</p>
                                        <p class="mt-sm"><span @click="authHelp" class="help grey-text">Auth:</span> {{server.auth_endpoint}}</p>
                                        <p class="mt-sm"><span @click="tokenHelp" class="help grey-text">Token:</span> {{server.token_endpoint}}</p>
                                        <p class="mt-sm"><span @click="redirectUriHelp" class="help grey-text">Redirect URI</span>: {{server.redirect_uri}}</p>
                                    </div>
                                    <div class="card-action">
                                        <div class="row mb0">
                                            <div class="col s6">
                                                <router-link :to="{name: 'explore', params: {id: server.id}}" tag="button" class="btn waves-effect waves-light teal thin-button lighten-1"><i class="fa fa-bolt" aria-hidden="true"></i>&nbsp;&nbsp;Use</router-link>
                                            </div>
                                            <div class="col s6">
                                                <router-link :to="{name: 'servers.edit', params: {id: server.id}}" tag="button" class="btn waves-effect waves-light teal lighten-1 thin-button right"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;Edit</router-link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
                <router-link :to="{name: 'servers.create'}" tag="button" class="btn-floating btn-large waves-effect waves-light teal lighten-1">
                    <i class="fa fa-plus"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import _ from 'lodash';
    import swal from 'sweetalert';
    import config from '../../config/env';
    import ServerService from '../../services/ServerService';
    import Promise from 'es6-promise';

    export default {
        serverService: null,
        data() {
            return {
                servers: [],
            }
        },
        created() {
            this.serverService = new ServerService();

            this.loadServers();
        },
        methods: {
            authHelp() {
                swal({
                    title: 'Open ID Connect',
                    text: 'This is the endpoint which is used to run open id connect authentication.',
                    type: 'info'
                });
            },
            tokenHelp() {
                swal({
                    title: 'Access Token',
                    text: 'This is the endpoint which needs to be hit to grab a new access token.',
                    type: 'info'
                });
            },
            redirectUriHelp() {
                swal({
                    title: 'Redirect URI',
                    text: 'This is the specific redirect url unique to this application and server.',
                    type: 'info'
                });
            },
            loadServers() {
                this.servers = [];

                this.serverService.index().then((_servers) => {
                    this.servers = _servers;

                    let rr_exists = false;

                    //look through existing
                    for(let i = 0; i < this.servers.length; i++){
                        if(this.servers[i].name === this.$parent.rets_rabbit.name){
                            rr_exists = true;
                            this.updateRRServer();
                            break;
                        }
                    }

                    //create it
                    if(!rr_exists){
                        this.serverService.store(this.$parent.rets_rabbit).then((server) => {
                            this.$parent.flash('info', 'Created the default Rets Rabbit server.', 4500);

                            this.serverService.index().then((servers) => {
                                this.servers = servers;
                            });
                        });
                    }
                });
            },
            updateRRServer() {
                this.findRRServer().then((server) => {
                    this.serverService.update(server.id, this.$parent.rets_rabbit).then(() => {
                        this.$parent.flash('info', 'The Rets Rabbit demo server has been updated.');
                    });
                }, () => {
                    this.$parent.flash('error', 'Could not find the default Rets Rabbit server.');
                });
            },
            findRRServer() {
                //Update the RR server in case any of the fields have changed
                return new Promise((resolve, reject) => {
                    this.serverService.index().then(servers => {
                        let found = false, server;
                        for(let i = 0, len = servers.length; i < len; i++){
                            if(servers[i].name === this.$parent.rets_rabbit.name){
                                found = true;
                                server = servers[i];
                                break;
                            }

                            if(found)
                                break;
                        }

                        if(found)
                            resolve(server);
                        else
                            reject();
                    });
                });
            }
        },
        computed: {
            chunk() {
                return _.chunk(this.servers, 3);
            }
        },
        watch: {
            $route () {
                this.loadServers();
            }
        }
    }
</script>

<style lang="sass">

</style>
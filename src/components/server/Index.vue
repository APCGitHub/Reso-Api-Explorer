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
                                        <p class="mt-sm"><span @click="dataHelp" class="help grey-text">Data:</span> {{server.data_endpoint}}</p>
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
    import FlashService from '../../services/FlashService';
    import Server from '../../models/Server';
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
        },
        mounted() {
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
            dataHelp() {
                swal({
                    title: 'Datasystem',
                    text: 'This is the url which the explorer needs to hit to grab listing data.',
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

                Server.all().then(servers => {
                    this.servers = servers;

                    return servers;
                }).then(servers => {
                    if(!servers.length || servers.length < config.servers.length){
                        FlashService.flash('info', 'Creating default servers');

                        //Create the default servers
                        this.serverService.createDefaultServers().then(res => {
                            Server.all().then(servers => {
                                FlashService.flash('success', 'Created the default servers!');
                                this.servers = servers;
                            });
                        }).catch(err => {
                            FlashService.flash('error', err);
                        });
                    } else {
                        FlashService.flash('info', 'Updating default servers');

                        //Create the default servers
                        this.serverService.updateDefaultServers().then(res => {
                            Server.all().then(servers => {
                                FlashService.flash('success', 'Updated the default servers!');
                                this.servers = servers;
                            });
                        }).catch(err => {
                            FlashService.flash('error', err);
                        });
                    }
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
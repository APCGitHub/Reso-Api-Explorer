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
                            <div class="col s12 m12 l6" v-for="server in servers">
                                <server-component :server="server"></server-component>   
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
                <router-link :to="{name: 'servers.create'}" tag="button" class="btn-floating btn-large waves-effect waves-light cyan lighten-1">
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
    import ServerComponent from './components/Server.vue';
    import Promise from 'bluebird';
    window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery.js');
    require('materialize-css');

    export default {
        components: {ServerComponent},
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
            loadServers() {
                this.servers = [];

                Server.all().then(servers => {
                    this.servers = servers;

                    return Promise.resolve(servers);
                }).then(servers => {
                    if(!servers.length || servers.length < config.servers.length){
                        FlashService.flash('info', 'Creating default servers');

                        //Create the default servers
                        this.serverService.createDefaultServers().then(res => {
                            Server.all().then(servers => {
                                FlashService.flash('success', 'Created the default servers!');
                                this.servers = servers;
                            });

                            return null;
                        }).catch(err => {
                            FlashService.flash('error', err);
                        });
                    } else {
                        //Create the default servers
                        this.serverService.updateDefaultServers().then(res => {
                            Server.all().then(servers => {
                                FlashService.flash('success', 'Updated the default servers!');
                                this.servers = servers;
                            });

                            return null;
                        }).catch(err => {
                            FlashService.flash('error', err);
                        });
                    }

                    return null;
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

<template>
    <div class="row">
        <div class="col s12">
            <div class="section mb0">
                <div class="row mb0">
                    <div class="col s6 offset-s3">
                        <h4 class="center-align">Your Servers</h4>
                        <p class="center-align" v-show="servers.length < 1">You currently haven't created any servers. Click the "+" below to get started.</p>
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
                                                <router-link :to="{name: 'explore', params: {id: server.id}}" tag="button" class="btn waves-effect waves-light teal lighten-1">Use</router-link>
                                            </div>
                                            <div class="col s6">
                                                <router-link :to="{name: 'servers.edit', params: {id: server.id}}" tag="button" class="btn waves-effect waves-light teal lighten-1 right">Edit</router-link>
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

    export default {
        data() {
            return {
                code: '',
                servers: [],
            }
        },
        created() {
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

                this.$parent.serverService.index().then((_servers) => {
                    this.servers = _servers;
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
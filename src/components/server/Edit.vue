<template>
    <div class="row">
        <div class="col s12 m8 offset-m2">
            <div class="section">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">Edit Server</span>
                        <div class="divider"></div>
                        <form @submit="validateBeforeSubmit" class="mt-sm">
                            <div class="row">
                                <div class="input-field col s6">
                                    <input placeholder="Matrix" name="name" type="text" id="name" v-model="server.name" v-validate.initial="server.name" data-vv-rules="required" :class="{'invalid': errors.has('name')}">
                                    <label for="name" class="active">Name <div class="inline-block clickable"><i class="tooltipped fa fa-question-circle clickable" data-position="bottom" data-delay="50" data-tooltip="Human readable name for the server."></i></div></label>
                                    <span class="error red-text darken-2" v-show="errors.has('name')">{{ errors.first('name') }}</span>
                                </div>
                                <div class="input-field col s6">
                                    <input placeholder="Matrix" name="id" type="text" id="id" v-model="server.id" v-validate.initial="server.id" data-vv-rules="required" :class="{'invalid': errors.has('id')}">
                                    <label for="id" class="active">Id <div class="inline-block clickable"><i class="tooltipped fa fa-question-circle clickable" data-position="bottom" data-delay="50" data-tooltip="Unique ID so that ReApi knows which server to redirect back to."></i></div></label>
                                    <span class="error red-text darken-2" v-show="errors.has('id')">{{ errors.first('id') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="client_id" type="text" id="client_id" v-validate.initial="server.client_id" v-model="server.client_id" data-vv-rules="required" :class="{'invalid': errors.has('server.client_id')}">
                                    <label for="client_id" class="active">Client ID</label>
                                    <span class="error red-text darken-2" v-show="errors.has('server.client_id')">{{ errors.first('server.client_id') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="auth_endpoint" type="text" id="auth_endpoint" v-model="server.auth_endpoint" v-validate.initial="server.auth_endpoint" data-vv-rules="required" :class="{'invalid': errors.has('server.auth_endpoint')}">
                                    <label for="auth_endpoint" class="active">Auth Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('server.auth_endpoint')">{{ errors.first('server.auth_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="token_endpoint" type="text" id="token_endpoint" v-model="server.token_endpoint" v-validate.initial="server.token_endpoint" data-vv-rules="required" :class="{'invalid': errors.has('server.token_endpoint')}">
                                    <label for="token_endpoint" class="active">Token Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('server.token_endpoint')">{{ errors.first('server.token_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="token_endpoint" type="text" id="data_endpoint" v-model="server.data_endpoint" v-validate.initial="server.data_endpoint" data-vv-rules="required" :class="{'invalid': errors.has('server.data_endpoint')}">
                                    <label for="data_endpoint" class="active">Data Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('server.data_endpoint')">{{ errors.first('server.data_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s12">
                                    <span class="blue-text clickable" @click="show_advanced = !show_advanced">Advanced</span>
                                    <div v-show="show_advanced">
                                        <div class="card-title">OpendID Parameters</div>
                                        <template v-if="server && server.config">
                                            <draggable :options="{handle: '.handle'}" :list="server.config.openid">
                                                <transition-group name="list" tag="div">
                                                    <open-id-config v-on:remove="deleteOpenIdConfig" :config="config" :key="index" :index="index" v-for="(config, index) in server.config.openid"></open-id-config>
                                                </transition-group>
                                            </draggable>
                                        </template>
                                        <button type="button" @click="addOpenIDConfig" class="waves-effect waves-light cyan thin-button lighten-1 btn"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb0">
                                <div class="col s12 center-align">
                                    <button :disabled="errors.any()" class="waves-effect waves-light cyan lighten-1 btn">Update</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed-action-btn" style="bottom: 45px; right: 24px;">
            <button @click="deleteServer" class="btn-floating btn-large waves-effect waves-light red lighten-2">
                <i class="fa fa-trash"></i>
            </button>
        </div>
    </div>
</template>

<script style="text/babel">
    import ServerService from '../../services/ServerService';
    import FlashService from '../../services/FlashService';
    import Server from '../../models/Server';
    import swal from 'sweetalert';
    import OpenIdConfig from './components/OpenIdConfig.vue';
    import Config from '../../config/env';
    import Draggable from 'vuedraggable';
    window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery.js');
    require('materialize-css');

    export default {
        serverService: null,
        components: {OpenIdConfig, Draggable},
        data() {
            return {
                show_advanced: true,
                server: {
                    id: '',
                    name: '',
                    client_id: '',
                    token_endpoint: '',
                    data_endpoint: '',
                    auth_endpoint: '',
                }
            }
        },
        created() {
            this.serverService = new ServerService();

            Server.find(this.$route.params.id).then(server => {
                let _servers = Config.servers;

                for(let i = 0; i < _servers.length; i++){
                    if(server.id === _servers[i].id && !_servers[i]['allow_edit']){
                        FlashService.flash('warning', 'You can\'t edit the default Rets Rabbit server!', 3000);
                        this.$router.go(-1);
                    }
                }

                this.server = server;
            }).catch(err => {
                this.$router.go(-1);
            });
        },
        watch: {
            $route () {
                Server.find(this.$route.params.id).then(server => {
                    this.server = server;
                }).catch(err => {
                    this.$router.go(-1);
                });
            }
        },
        methods: {
            validateBeforeSubmit(e) {
                this.$validator.validateAll();

                e.preventDefault();

                if (this.errors.any()) {
                    return;
                }

                this.server.update(this.server).then(server => {
                    FlashService.flash('success', 'Successfully updated server: ' + server.name);
                    this.$router.go(-1);
                }).catch(err => {
                    FlashService.flash('error', 'Could not update this server. Please try again');
                });
            },
            deleteServer(){
                swal({
                    title: 'Delete Server',
                    text: 'Are you sure you want to permanently delete this server?',
                    type: 'warning'
                }, (confirmed) => {
                    if(confirmed){
                        this.server.destroy().then(() => {
                            FlashService.flash('success', 'Deleted the server');
                            this.$router.replace('/servers');
                        }).catch(() => {
                            swal('Uh oh', 'There was an error deleting this server', 'warning');
                        });
                    }
                });
            },
            addOpenIDConfig() {
                let config = {
                    name: '',
                    key: '',
                    value: '',
                    required: false,
                    no_value: false
                };

                this.server.config.openid.push(config);
            },
            deleteOpenIdConfig(index) {
                this.server.config.openid.splice(index, 1);
            }
        }
    }
</script>
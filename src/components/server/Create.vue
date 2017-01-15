<template>
    <div class="row">
        <div class="col s12 m8 offset-m2">
            <div class="section">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">New Server</span>
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
                                    <input placeholder="random_string" name="client_id" type="text" id="client_id" v-model="server.client_id" v-validate.initial="server.client_id" data-vv-rules="required" :class="{'invalid': errors.has('client_id')}">
                                    <label for="client_id" class="active">Client ID</label>
                                    <span class="error red-text darken-2" v-show="errors.has('client_id')">{{ errors.first('client_id') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input placeholder="http://api.com/api/oauth/authorize" name="auth_endpoint" type="text" id="auth_endpoint" v-model="server.auth_endpoint" v-validate.initial="server.auth_endpoint" data-vv-rules="required" :class="{'invalid': errors.has('auth_endpoint')}">
                                    <label class="active" for="auth_endpoint">Auth Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('auth_endpoint')">{{ errors.first('auth_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input placeholder="http://api.com/api/oauth/access_token" name="token_endpoint" type="text" id="token_endpoint" v-model="server.token_endpoint" v-validate.initial="server.token_endpoint" data-vv-rules="required" :class="{'invalid': errors.has('token_endpoint')}">
                                    <label class="active" for="token_endpoint">Token Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('token_endpoint')">{{ errors.first('token_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input placeholder="http://api.com/api/oauth/access_token" name="data_endpoint" type="text" id="data_endpoint" v-model="server.data_endpoint" v-validate.initial="server.data_endpoint" data-vv-rules="required" :class="{'invalid': errors.has('data_endpoint')}">
                                    <label class="active" for="data_endpoint">Data Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('data_endpoint')">{{ errors.first('data_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s12">
                                    <span class="blue-text clickable" @click="show_advanced = !show_advanced">Advanced</span>
                                    <div v-show="show_advanced">
                                        <div class="card-title">OpendID Parameters</div>
                                        <draggable :options="{handle: '.handle'}" :list="server.config.openid">
                                            <transition-group name="list" tag="div">
                                                <open-id-config :key="index" v-on:remove="deleteOpenIdConfig" :config="config" :index="index" v-for="(config, index) in server.config.openid"></open-id-config>
                                            </transition-group>
                                        </draggable>
                                        <button type="button" @click="addOpenIDConfig" class="waves-effect waves-light cyan thin-button lighten-1 btn"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb0">
                                <div class="col s12 center-align">
                                    <button :disabled="errors.any()" class="waves-effect waves-light cyan lighten-1 btn">Create</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import FlashService from '../../services/FlashService';
    import Server from '../../models/Server';
    import OpenIdConfig from './components/OpenIdConfig.vue';
    import Draggable from 'vuedraggable';
    import ServerService from '../../services/ServerService';
    window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery.js');
    require('materialize-css');

    export default {
        components: {OpenIdConfig, Draggable},
        serverService: null,
        data() {
            return {
                server: new Server(),
                id: '',
                client_id: '',
                name: '',
                auth_endpoint: '',
                token_endpoint: '',
                data_endpoint: '',
                show_advanced: false
            }
        },
        created() {
            this.serverService = new ServerService();
        },
        mounted() {
            $(document).ready(() => {
                $('.tooltipped').tooltip({delay: 50});
            });     
        },
        methods: {
            validateBeforeSubmit(e) {
                e.preventDefault();

                this.$validator.validateAll();

                if (this.errors.any()) {
                    return;
                }

                Server.create(this.server).then((server) => {
                    FlashService.flash('success', 'Created your new server: ' + server.name);
                    this.$router.replace('/servers');
                }).catch(() => {
                    swal({
                        title: 'Uh oh',
                        text: 'There was an error creating your server. Please try again.',
                        type: 'warning'
                    });
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

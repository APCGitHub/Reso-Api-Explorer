<template>
    <div class="row">
        <div class="col s12 m6 offset-m3">
            <div class="section">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">New Server</span>
                        <div class="divider"></div>
                        <form @submit="validateBeforeSubmit" class="mt-sm">
                            <div class="row">
                                <div class="input-field col s12">
                                    <input placeholder="Matrix" name="name" type="text" id="name" v-model="name" v-validate.initial="name" data-rules="required" :class="{'invalid': errors.has('name')}">
                                    <label for="name" class="active">Name</label>
                                    <span class="error red-text darken-2" v-show="errors.has('name')">{{ errors.first('name') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input placeholder="random_string" name="client_id" type="text" id="client_id" v-model="client_id" v-validate.initial="client_id" data-rules="required" :class="{'invalid': errors.has('client_id')}">
                                    <label for="client_id" class="active">Client ID</label>
                                    <span class="error red-text darken-2" v-show="errors.has('client_id')">{{ errors.first('client_id') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input placeholder="http://api.com/api/oauth/authorize" name="auth_endpoint" type="text" id="auth_endpoint" v-model="auth_endpoint" v-validate.initial="auth_endpoint" data-rules="required" :class="{'invalid': errors.has('auth_endpoint')}">
                                    <label class="active" for="auth_endpoint">Auth Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('auth_endpoint')">{{ errors.first('auth_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input placeholder="http://api.com/api/oauth/access_token" name="token_endpoint" type="text" id="token_endpoint" v-model="token_endpoint" v-validate.initial="token_endpoint" data-rules="required" :class="{'invalid': errors.has('token_endpoint')}">
                                    <label class="active" for="token_endpoint">Token Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('token_endpoint')">{{ errors.first('token_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input placeholder="http://api.com/api/oauth/access_token" name="data_endpoint" type="text" id="data_endpoint" v-model="data_endpoint" v-validate.initial="data_endpoint" data-rules="required" :class="{'invalid': errors.has('data_endpoint')}">
                                    <label class="active" for="data_endpoint">Data Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('data_endpoint')">{{ errors.first('data_endpoint') }}</span>
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

    export default {
        serverService: null,
        data() {
            return {
                client_id: '',
                name: '',
                auth_endpoint: '',
                token_endpoint: '',
                data_endpoint: ''
            }
        },
        created() {

        },
        methods: {
            validateBeforeSubmit(e) {
                e.preventDefault();

                this.$validator.validateAll();

                if (this.errors.any()) {
                    return;
                }

                Server.create({
                    name: this.name,
                    client_id: this.client_id,
                    token_endpoint: this.token_endpoint,
                    auth_endpoint: this.auth_endpoint,
                    data_endpoint: this.data_endpoint
                }).then((server) => {
                    FlashService.flash('success', 'Created your new server: ' + server.name);
                    this.$router.replace('/servers');
                }).catch(() => {
                    swal({
                        title: 'Uh oh',
                        text: 'There was an error creating your server. Please try again.',
                        type: 'warning'
                    });
                });
            }
        }
    }
</script>

<style lang="sass"></style>
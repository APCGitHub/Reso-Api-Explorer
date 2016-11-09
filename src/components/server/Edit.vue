<template>
    <div class="row">
        <div class="col s12 m6 offset-m3">
            <div class="section">
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">Edit Server</span>
                        <div class="divider"></div>
                        <form @submit="validateBeforeSubmit" class="mt-sm">
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="name" type="text" id="name" v-validate.initial="server.name" v-model="server.name" data-rules="required" :class="{'invalid': errors.has('server.name')}">
                                    <label for="name" class="active">Name</label>
                                    <span class="error red-text darken-2" v-show="errors.has('server.name')">{{ errors.first('server.name') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="client_id" type="text" id="client_id" v-validate.initial="server.client_id" v-model="server.client_id" data-rules="required" :class="{'invalid': errors.has('server.client_id')}">
                                    <label for="client_id" class="active">Client ID</label>
                                    <span class="error red-text darken-2" v-show="errors.has('server.client_id')">{{ errors.first('server.client_id') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="auth_endpoint" type="text" id="auth_endpoint" v-model="server.auth_endpoint" v-validate.initial="server.auth_endpoint" data-rules="required" :class="{'invalid': errors.has('server.auth_endpoint')}">
                                    <label for="auth_endpoint" class="active">Auth Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('server.auth_endpoint')">{{ errors.first('server.auth_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input name="token_endpoint" type="text" id="token_endpoint" v-model="server.token_endpoint" v-validate.initial="server.token_endpoint" data-rules="required" :class="{'invalid': errors.has('server.token_endpoint')}">
                                    <label for="token_endpoint" class="active">Auth Endpoint</label>
                                    <span class="error red-text darken-2" v-show="errors.has('server.token_endpoint')">{{ errors.first('server.token_endpoint') }}</span>
                                </div>
                            </div>
                            <div class="row mb0">
                                <div class="col s12 center-align">
                                    <button :disabled="errors.any()" class="waves-effect waves-light btn">Update</button>
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
    import swal from 'sweetalert';

    export default {
        data() {
            return {
                server: {
                    id: '',
                    name: '',
                    client_id: ''
                }
            }
        },
        created() {
            this.$parent.serverService.show(this.$route.params.id).then((server) => {
                //If editing the RR server then go back
                if(server.name === this.$parent.rets_rabbit.name){
                    Materialize.toast('You can\'t edit the default Rets Rabbit server!', 4500, 'warning');
                    this.$router.go(-1);
                } else {
                    this.server = server;
                }
            }, (err) => {
                this.$router.go(-1);
            });
        },
        watch: {
            $route () {
                let server = this.$parent.serverService.show(this.$route.params.id).then((server) => {
                    this.server = server;
                }, (err) => {
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

                this.$parent.serverService.update(this.server.id, this.server).then((server) =>{
                    this.$parent.flash('success', 'Successfully updated server: ' + server.name);
                    this.$router.replace('/servers');
                });
            },
            deleteServer(){
                swal({
                    title: 'Delete Server',
                    text: 'Are you sure you want to permanently delete this server?',
                    type: 'warning'
                }, (confirmed) => {
                    if(confirmed){
                        this.$parent.serverService.destroy(this.server.id).then(() => {
                            this.$parent.flash('success', 'Deleted the server');
                            this.$router.replace('/servers');
                        }, () => {
                            swal('Uh oh', 'There was an error deleting this server', 'warning');
                        });
                    }
                });
            }
        }
    }
</script>
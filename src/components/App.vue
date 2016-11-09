<template>
    <div id="wrapper">
        <div class="navbar-fixed">
            <nav class="teal">
                <div class="nav-wrapper">
                    <router-link to="/" class="brand-logo">{{siteName}}</router-link>
                    <ul class="right hide-on-med-and-down">
                        <router-link :to="{name: 'home'}" tag="li"><a>Home</a></router-link>
                        <router-link :to="{name: 'servers.index'}" tag="li"><a>Servers</a></router-link>
                    </ul>
                </div>
            </nav>
        </div>
        <div class="container">
            <div class="row">
                <div class="col s12">
                    <transition>
                        <router-view class="view"></router-view>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import serverService from '../services/ServerService';
    import config from '../config/env';

    export default {
        data() {
            return {
                siteName: config.APP_NAME,
                rets_rabbit: {
                    name: 'Rets Rabbit Test',
                    client_id: '',
                    client_secret: '',
                    access_token: '',
                    auth_endpoint: '',
                    token_endpoint: ''
                }
            }
        },
        created() {
            this.rets_rabbit.auth_endpoint = config.API_URL + 'api/oauth/authorize';
            this.rets_rabbit.token_endpoint = config.API_URL + 'api/oauth/access_token';
            this.rets_rabbit.client_id = config.CLIENT_ID || 'retsrabbit';
            this.rets_rabbit.client_secret = config.CLIENT_SECRET || 'retsrabbit';
        },
        methods: {
            flash(type, message, duration) {
                if(!duration){
                    duration = 3000;
                }

                Materialize.toast(message, duration, type);
            }
        }
    }
</script>

<style style="lang">

</style>
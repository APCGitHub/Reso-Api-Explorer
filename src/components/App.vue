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
                siteName: config.ENV.APP_NAME
            }
        },
        methods: {
        }
    }
</script>

<style style="lang">

</style>
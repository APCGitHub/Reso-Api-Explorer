<template>
    <div id="wrapper">
        <div class="navbar-fixed">
            <nav class="teal darken-1 navbar">
                <div class="nav-wrapper">
                    <router-link to="/" class="brand-logo">{{siteName}}</router-link>
                    <ul class="right hide-on-med-and-down">
                        <router-link :to="{name: 'home'}" tag="li"><a>Home</a></router-link>
                        <router-link :to="{name: 'servers.index'}" tag="li"><a>Servers</a></router-link>
                    </ul>
                </div>
            </nav>
            <nav class="teal breadcrumbs">
                <div class="nav-wrapper">
                    <div class="col s12">
                        <breadcrumbs></breadcrumbs>
                    </div>
                </div>
            </nav>
        </div>
        <div class="container">
            <div class="row">
                <div class="col s12">
                    <transition name="fade" appear mode="out-in">
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
    import Breadcrumbs from './Breadcrumbs.vue';

    export default {
        components: {
            Breadcrumbs
        },
        data() {
            return {
                siteName: config.ENV.APP_NAME,
                transition: {
                    enter: '',
                    leave: ''
                }
            }
        },
        methods: {}
    }
</script>

<style>
    .fade-enter-active {
        animation: fadeIn 0.15s;
    }

    .fade-leave {
        opacity: 0;
    }

    .fade-leave-active {
        animation: fadeOut 0.15s;
    }
</style>
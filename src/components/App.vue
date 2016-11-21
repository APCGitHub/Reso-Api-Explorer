<template>
    <div id="wrapper">
        <div class="navbar-fixed">
            <nav class="deep-orange lighten-1 navbar">
                <div class="nav-wrapper">
                    <router-link to="/" tag="a" class="brand-logo">{{siteName}}</router-link>
                    <a href="#" data-activates="mobile-demo" class="button-collapse">
                        <i class="fa fa-bars" aria-hidden="true"></i>
                    </a>
                    <ul class="right hide-on-med-and-down">
                        <router-link :to="{name: 'home'}" tag="li"><a>Home</a></router-link>
                        <router-link :to="{name: 'servers.index'}" tag="li"><a>Servers</a></router-link>
                        <li><a href="https://retsrabbit.com" target="_blank">Rets Rabbit</a></li>
                    </ul>
                    <ul class="side-nav" id="mobile-demo">
                        <router-link :to="{name: 'home'}" tag="li"><a>Home</a></router-link>
                        <router-link :to="{name: 'servers.index'}" tag="li"><a>Servers</a></router-link>
                        <li><a href="https://retsrabbit.com" target="_blank">Rets Rabbit</a></li>
                    </ul>
                </div>
            </nav>
            <nav class="deep-orange lighten-2 breadcrumbs">
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
                },
                scroll: {
                    delta: 5,
                    did: false,
                    last_scroll_top: 0,
                    nav_height: 63
                }
            }
        },
        mounted () {
            $(document).ready(() => {
                //Init the sidenav
                $(".button-collapse").sideNav({
                    closeOnClick: true,
                    draggable: true
                });

                $(window).scroll(() => {
                    this.scroll.did = true;
                });

                //Make sure the nav is closed if we aren't on mobile
                $(window).resize(function () {
                    let width = $(window).width();

                    //TODO: This could be better optimized
                    if(width > 600){
                        $('.button-collapse').sideNav('hide');
                    }
                });
            });

            setInterval(() => {
                if (this.scroll.did) {
                    this.hasScrolled();
                    this.scroll.did = false;
                }
            }, 250);
        },
        methods: {
            hasScrolled () {
                let st = $(document).scrollTop();

                if (Math.abs(this.scroll.last_scroll_top - st) <= this.scroll.delta)
                    return;

                // If current position > last position AND scrolled past navbar...
                if (st > this.scroll.last_scroll_top && st > this.scroll.nav_height){
                    // Scroll Down
                    $('nav.breadcrumbs').addClass('nav-up');
                } else {
                    // Scroll Up
                    // If did not scroll past the document (possible on mac)...
                    if(st + $(window).height() < $(document).height()) {
                        $('nav.breadcrumbs').removeClass('nav-up');
                    }
                }

                this.scroll.last_scroll_top = st;
            }
        }
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
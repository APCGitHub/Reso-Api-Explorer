<template>
    <div class="row">
        <div class="col s12 m10 offset-m1 l8 offset-l2">
            <div class="section">
                <div class="row">
                    <div class="col s12">
                        <div class="card mt-lg">
                            <div class="card-content">
                                <div class="row">
                                    <div class="valign-wrapper">
                                        <div class="col s3 m4 center-align">
                                            <img class="align" src="img/rr-logo.png" width="80">
                                        </div>
                                        <div class="col s9 m8">
                                            <div class="center-align">
                                                <span class="card-title">Welcome to {{site_name}}</span>
                                                <br>
                                                <span class="card-title"><small>powered by <a href="https://retsrabbit.com" target="_blank">Rets Rabbit</a></small></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="divider mt-md"></div>
                                <div class="section mt-sm">
                                    <h5 class="center-align">Designed by developers. For developers.</h5>
                                    <div class="center-align mt-lg">
                                        <router-link to="/servers" class="waves-effect waves-light cyan lighten-1 btn">Go To Servers</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="row">
                    <div class="col s12">
                        <div class="card">
                            <div class="card-content">
                                <div class="card-title">
                                    Upcoming Features
                                </div>
                                <div class="collection">
                                    <a href="http://www.odata.org/blog/geospatial-properties/" target="_blank" class="collection-item">Polygon Searching</a>
                                    <a href="http://www.odata.org/blog/geospatial-properties/" target="_blank" class="collection-item">Multi Polygon Searching</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import config from '../config/env';

    export default {
        data() {
            return {
                site_name: config.ENV.APP_NAME//
            }
        },
        methods: {

        }
    }
</script>

<style>

</style>
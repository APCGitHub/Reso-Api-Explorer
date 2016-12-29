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
                                    <p class="center-align">This is an open source, browser based, API explorer for testing and evaluating real estate API servers that adhere to the <a href="http://www.reso.org/reso-web-api/" target="_blank">RESO Web API standard</a>.</p>
                                    <p class="center-align">Click the button below to add your RESO Web API server or use our default demo server to check out the explorer.</p>
                                    <div class="center-align mt-lg">
                                        <router-link to="/servers" class="waves-effect waves-light cyan lighten-1 btn">Go To Servers</router-link>
                                    </div>
                                    <p>Disclaimer: This tool is not affiliated with the Real Estate Standards Organization (<a href="http://reso.org" target="_blank">RESO</a>). The source code for this tool can be found <a href="https://github.com/Anecka/Reso-Api-Explorer">here</a>. </p>
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
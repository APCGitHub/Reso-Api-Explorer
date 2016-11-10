<template>
    <div class="row mt-lg">
        <div class="col s12">
            <div class="section">
                <div class="card">
                    <div class="card-content">
                        <div class="row">
                            <div class="col s12">
                                <span class="card-title"><strong>Example Queries</strong></span>
                                <button @click="toggleQueryBox" class="waves-effect waves-light btn right">
                                    <span v-show="!show_queries">Show</span>
                                    <span v-show="show_queries">Hide</span>
                                </button>
                            </div>
                        </div>
                        <transition name="fade">
                            <div class="section" v-show="show_queries">
                                <div v-for="row of chunk" class="row">
                                    <div class="col m12 l4" v-for="query of row">
                                        <div class="card teal lighten-4 hoverable">
                                            <div class="card-content">
                                                <span class="card-title white-text">{{query.title}}</span>
                                                <div>{{query.description}}</div>
                                            </div>
                                            <div class="card-action center-align try-query">
                                                <button @click="tryQuery(query)" class="waves-effect waves-light btn">Try It!</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="row">
                    <div :class="{'l6 offset-l3': map.expanded}" class="col m12 l6 query-col no-overflow">
                        <div class="card query-builder-wrapper">
                            <div class="card-content">
                                <span class="card-title">Query Builder</span>
                                <div class="section query-builder">
                                    <div class="row">
                                        <div class="col s12">
                                            <div class="input-field">
                                                <input v-model="query_builder.select" placeholder="ListPrice" id="select" type="text">
                                                <label class="active" for="select">$select</label>
                                            </div>
                                        </div>
                                    </div>
                                    <transition-group name="list" tag="div">
                                        <div class="row" v-for="(filter, index) in query_builder.filter" :key="index">
                                            <div class="valign-wrapper">
                                                <div class="col s12 m9">
                                                    <div class="input-field">
                                                        <input v-validate data-rules="required" :class="{'invalid': errors.has('filter_' + index)}" v-model="query_builder.filter[index].value" id="filter" :name="'filter_' + index" type="text" placeholder="ListPrice ge 100000">
                                                        <label class="active" for="filter">$filter</label>
                                                        <span class="error red-text darken-2" v-show="errors.has('filter_' + index)">{{ errors.first('filter_' + index) }}</span>
                                                    </div>
                                                </div>
                                                <div class="col s12 m3">
                                                    <button @click="removeFilter(index)" class="waves-effect waves-light red lighten-2 btn valign right">
                                                        <i class="fa fa-trash" aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="input-field col s12 m4 offset-m4" v-if="(index+1) != query_builder.filter.length">
                                                <select :name="'join_' + index" v-model="query_builder.filter[index].join" class="browser-default">
                                                    <option value=""></option>
                                                    <option value="and">and</option>
                                                    <option value="or">or</option>
                                                </select>
                                            </div>
                                        </div>
                                    </transition-group>
                                    <div class="row">
                                        <div class="valign-wrapper">
                                            <div class="col s7" v-show="query_builder.filter.length < 1">
                                                <div class="card-panel center-align">
                                                    <i class="fa fa-leaf left" aria-hidden="true"></i>
                                                    <p>No filters added yet!</p>
                                                </div>
                                            </div>
                                            <div class="col s5">
                                                <button @click="addFilter" class="waves-effect waves-light btn right"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="divider"></div>
                                    <transition-group name="list" tag="div">
                                        <div class="row" :key="index" :class="{'mt-md': index == 0}" v-for="(orderby, index) in query_builder.orderby">
                                            <div class="valign-wrapper">
                                            <div class="input-field col s5">
                                                <input v-validate data-rules="required" type="text" id="orderby" :name="'orderby_' + index" v-model="query_builder.orderby[index].value">
                                                <label class="active" for="orderby">$orderby</label>
                                                <span class="error red-text darken-2" v-show="errors.has('orderby_' + index)">{{ errors.first('orderby_' + index) }}</span>
                                            </div>
                                            <div class="input-field col s4">
                                                <select class="browser-default" v-model="query_builder.orderby[index].direction">
                                                    <option></option>
                                                    <option value="asc">asc</option>
                                                    <option valu="desc">desc</option>
                                                </select>
                                            </div>
                                            <div class="col s3">
                                                <button @click="removeOrderby(index)" class="waves-effect waves-light red lighten-2 btn valign right">
                                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                        </div>
                                    </transition-group>
                                    <div class="row mt-md">
                                        <div class="valign-wrapper">
                                            <div class="col s7" v-show="query_builder.orderby.length < 1">
                                                <div class="card-panel center-align">
                                                    <i class="fa fa-leaf left" aria-hidden="true"></i>
                                                    <p>No orderby's added yet!</p>
                                                </div>
                                            </div>
                                            <div class="col s5">
                                                <button @click="addOrderby" class="waves-effect waves-light btn right"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="divider"></div>
                                    <div class="row mt-md mb0">
                                        <div class="input-field col s4">
                                            <input type="tel" v-validate data-rules="numeric" :class="{'invalid': errors.has('top')}" placeholder="100" name="top" v-model="query_builder.top" id="top">
                                            <label for="top" class="active">$top</label>
                                            <span class="error red-text darken-2" v-show="errors.has('top')">{{ errors.first('top') }}</span>
                                        </div>
                                        <div class="input-field col s4 offset-s2">
                                            <input type="tel" v-validate data-rules="numeric" :class="{'invalid': errors.has('skip')}" placeholder="10" name="skip" v-model="query_builder.skip" id="skip">
                                            <label for="skip" class="active">$skip</label>
                                            <span class="error red-text darken-2" v-show="errors.has('skip')">{{ errors.first('skip') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-action">
                                <div class="row mb0">
                                    <div class="col s6 center-align">
                                        <button @click="clear" class="btn waves-effect red lighten-2 waves-light btn"><i class="fa fa-times left" aria-hidden="true"></i>Clear</button>
                                    </div>
                                    <div class="col s6 center-align">
                                        <button @click="search" class="btn waves-effect waves-light btn" :disabled="errors.any() || query.searching">
                                            <span v-show="!query.searching">
                                                <i class="fa fa-search left" aria-hidden="true"></i>Search
                                            </span>
                                            <span v-show="query.searching">
                                                <i class="fa fa-spinner fa-spin left" aria-hidden="true"></i>Searching
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div :class="{'l12 big-map': map.expanded}" id="map-col" class="col m12 l6">
                        <div class="card">
                            <div class="card-content">
                                <div class="row mb0">
                                    <div class="col s12">
                                        <span class="card-title">Map</span>
                                        <!--
                                        <button class="waves-effect waves-light btn right" @click="toggleMapSize">
                                            <span v-show="map.expanded">Shrink</span>
                                            <span v-show="!map.expanded">Expand</span>
                                        </button>
                                        -->
                                    </div>
                                </div>
                                <div class="map-help">
                                    <small class="grey-text">
                                        Refine your queries by drawing on the map below.
                                    </small>
                                </div>
                                <div class="divider mt-sm"></div>
                                <div class="section">
                                    <div id="map"></div>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-content">
                                <div class="row">
                                    <div class="col s6">
                                        <div class="card-title">Query</div>
                                    </div>
                                    <div class="col s6">
                                        <router-link v-if="server" :to="{name: 'servers.edit', params: {id: server.id}}" tag="button" class="right waves-effect waves-light btn thin-button">Edit Server</router-link>
                                        <button v-if="!server" class="right waves-effect waves-light btn thin-button">Edit Server</button>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col s12">
                                        <pre class="grey lighten-3 p-sm">{{url}}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section" v-show="query.auth_error">
                <div class="row">
                    <div class="col s6 offset-s3 center-align">
                        <button id="token-refresh-button" class="waves-effect waves-light btn-large" @click="fetchAuthCode">Get New Token</button>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="row">
                    <div class="col s12 m10 offset-m1">
                        <div class="card">
                            <div class="card-content">
                                <div class="row" v-if="query.results">
                                    <div class="col s12 m4 card-title">Total: {{query.results['@retsrabbit.total_results']}}</div>
                                    <div class="col s12 m4 card-title center-align">Results: {{query.results['@odata.count']}}</div>
                                    <div class="col s12 m4 card-title">
                                        <span class="right">{{query.round_trip}}ms</span>
                                    </div>
                                </div>
                                <div class="card-title center-align" v-show="!query.results">
                                    <span>Results</span>
                                </div>
                                <div class="row">
                                    <div class="col s12">
                                        <results :results="query.results"></results>
                                    </div>
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
    import queryService from '../services/QueryService';
    import googleMapService from '../services/GoogleMaps';
    import markerService from '../services/MarkerService';
    import accessTokenSerivce from '../services/AccessTokenService';
    import serverService from '../services/ServerService';
    import Results from './Results.vue';
    import Server from '../models/Server';
    import _ from 'lodash';
    import $ from 'jquery';
    import swal from 'sweetalert';
    import Promise from 'es6-promise';
    import config from '../config/env';

    export default {
        components: {Results},
        data() {
            return {
                server: null,
                code: null,
                services: {
                    query_service: null,
                    map_service: null,
                    accesstoken_service: null,
                    marker_service: null,
                    server_service: null
                },
                example_queries: [],
                show_queries: false,
                map: {
                    expanded: false,
                    instance: null
                },
                query_builder: {
                    select: '',
                    filter: [],
                    orderby: [],
                    top: '',
                    skip: ''
                },
                query: {
                    auth_error: false,
                    string: '',
                    searching: false,
                    results: null,
                    round_trip: null
                },
                api: {
                    access_token: 'jowz5ihuQST0zsj3JdBPz0qGBgEFXQspipt34Qd9',
                    url: 'http://retsrabbit.app/api/'
                }
            }
        },
        created() {
            let id = this.$route.params.id;

            this.services.server_service = new serverService();

            //Query Service
            this.services.query_service = new queryService();

            //Server from id
            Server.find(id).then((server) => {
                //Bind the server
                this.server = server;

                /**
                 * Instantiate the services
                 */
                this.services.accesstoken_service = new accessTokenSerivce(this.server);

                /**
                 * If there is a redirect code in the url
                 */
                if(this.$route.query.code){
                    this.code = this.$route.query.code;

                    //If this is a default server
                    if(this.server.client_secret){
                        this.getToken(this.server.client_secret).then(() => {
                            swal({
                                title: 'Success',
                                text: 'Grabbed a new access token!',
                                type: 'success'
                            });

                            //Get rid of the code from the url
                            let url = window.location.href;
                            let i = url.indexOf('?code');

                            url = url.substring(0, i);

                            window.location = url;
                        }, () => {
                            swal({
                                title: 'Uh oh',
                                text: 'There was a problem getting the access token',
                                type: 'warning'
                            });
                        });
                    } else {
                        //This is not a default server so ask for a secret
                        swal({
                            title: "Credentials",
                            text: "Please supply your client_secret.",
                            type: "input",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            animation: "slide-from-top",
                            inputPlaceholder: "secret"
                        },
                        (client_secret) => {
                            //If they cancel then back 'em out of there real good
                            if (client_secret === false) {
                                this.$router.replace('/servers');
                                return false;
                            }

                            //If empty make sure they try again
                            if (client_secret === "") {
                                swal.showInputError("You need to write something!");
                                return false
                            }

                            //See what we can do about getting a new access_token
                            if(this.services.accesstoken_service){
                                this.getToken(client_secret).then(() => {
                                    swal({
                                        title: 'Success',
                                        text: 'Grabbed a new access token!',
                                        type: 'success'
                                    });

                                    //Get rid of the code from the url
                                    let url = window.location.href;
                                    let i = url.indexOf('?code');

                                    url = url.substring(0, i);

                                    window.location = url;
                                }, () => {
                                    swal({
                                        title: 'Uh oh',
                                        text: 'There was a problem getting the access token',
                                        type: 'warning'
                                    });
                                });
                            }
                        });
                    }
                } else { //no redirect url so we are hitting for the first time
                    if(!this.server.access_token){
                        this.fetchAuthCode();
                    }
                }
            }, (err) => {
                //Could not find that server
                this.$router.replace('/servers');
            });
        },
        mounted() {
            //Example queries
            this.example_queries = this.services.query_service.exampleQueries;

            //Load map service when DOM is ready
            this.services.map_service = new googleMapService(document.getElementById('map'), {
                center: {
                    lat: 39.9612,
                    lng: -82.9988
                },
                zoom: 10
            });

            //Load the google map
            this.services.map_service.load((map) => {
                this.map.instance = map;
                this.services.marker_service = new markerService(this.map.instance);

//                google.maps.event.addDomListener(document.getElementById('map'), "resize", () => {
//                    console.log('resize');
//                    var center = this.map.instance.getCenter();
//                    google.maps.event.trigger(this.map.instance, "resize");
//                    this.map.instance.setCenter(center);
//                });
            });

            //Handle query click scroll
            $(document).ready(() => {
                $('.try-query').click(() => {
                    $('html, body').animate({
                        scrollTop: $(".query-builder-wrapper").offset().top
                    }, 400);
                });
            });
        },
        methods: {
            /**
             * Clear the query builder
             */
            clear(){
                this.query_builder = {
                    select: '',
                    filter: [],
                    orderby: [],
                    top: '',
                    skip: ''
                };
            },
            /**
             * Commit a listing search
             */
            search(){
                this.$validator.validateAll();

                //Don't allow them to search if there are any validation errors
                if(this.errors.any()){
                    return;
                }

                let url = this.url;
                let start = performance.now();
                this.query.searching = true;
                this.query.results = null;
                this.query.round_trip = null;
                this.query.auth_error = false;

                this.$http.get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.server.access_token
                    }
                }).then((res) => {
                    let resBody = res.body;
                    let end = performance.now();

                    this.query.searching = false;
                    this.query.results = resBody;
                    this.query.round_trip = (end - start).toFixed(0);
                    this.services.marker_service.plotMarkers(this.query.results.value);
                }, (res) => {
                    let resBody = res.body;
                    console.log(resBody);

                    this.query.searching = false;
                    this.query.results = resBody;

                    if(res.status == 401){
                        this.query.auth_error = true;
                        swal('Authenitcation Error', 'It looks like your access_token may have become invalid.', 'warning');

                        setTimeout(() => {
                            $('html, body').animate({
                                scrollTop: $('#token-refresh-button').offset().top
                            }, 400);
                        }, 300);
                    }
                });
            },
            /**
             * Hide show the query box
             */
            toggleQueryBox() {
                this.show_queries = !this.show_queries;
            },
            /**
             * Load a query from the example queries
             *
             * @param q     The Query
             */
            tryQuery(q) {
                this.query_builder.select = q.query.select;
                this.query_builder.filter = q.query.filter;
                this.query_builder.orderby = q.query.orderby;
                this.query_builder.top = q.query.top;
                this.query_builder.skip = q.query.skip;
            },
            /**
             * Remove a filter.
             *
             * @param index
             */
            removeFilter(index) {
                this.query_builder.filter.splice(index, 1);
            },
            /**
             * Add a filter.
             */
            addFilter() {
                this.query_builder.filter.push({
                    value: '',
                    join: 'and'
                });
            },
            /**
             * Remove an orderby index.
             *
             * @param index
             */
            removeOrderby(index){
                this.query_builder.orderby.splice(index, 1);
            },
            /**
             * Add an orderby
             */
            addOrderby(){
                this.query_builder.orderby.push({
                    value: '',
                    direction: 'asc'
                });
            },
            /**
             * This method grabs an auth code from the authorizer if granted access
             */
            fetchAuthCode() {
                let url = this.server.auth_endpoint;

                url += '?client_id=' + this.server.client_id;
                url += '&redirect_uri=' + encodeURIComponent(this.server.redirect_uri);
                url += '&response_type=code';

                window.location = url;
            },
            /**
             * Toggle the size of the map
             */
            toggleMapSize() {
                this.map.expanded = !this.map.expanded;

                setTimeout(() => {
                    let offset = $('#map-col').offset().top;

                    offset += -100;

                    $('html, body').animate({
                        scrollTop: offset
                    }, 400);
                }, 400);
            },
            getToken(client_secret) {
                return new Promise((resolve, reject) => {
                    this.services.accesstoken_service.getToken(client_secret, this.code).then((res) => {
                        let resBody = res.body;

                        //Try to update the server with the new access token
                        this.server.update({
                            access_token: resBody.access_token
                        }).then((server) => {
                            this.server = server;

                            resolve(1);
                        }, () => {
                            reject();
                        });
                    }, (err) => {
                        console.log(err);
                        reject(err);
                    });
                });
            }
        },
        computed: {
            chunk() {
                return _.chunk(this.example_queries, 3);
            },
            url() {
                if(!this.server){
                    return '';
                } else {
                    let base = this.server.data_endpoint;
                    let s = this.services.query_service.buildUrl(this.query_builder);

                    if(base.substring(base.length - 1) !== '/')
                        base += '/';

                    base += 'property?' + s;

                    return base;
                }
            }
        }
    }
</script>

<style lang="sass">
    .big-map
        #map
            height: 500px

    #map
        height: 350px

    .map-help
        small
            font-size: 0.9em
</style>

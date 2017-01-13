<template>
    <div class="row mt-lg">
        <div class="col s12">
            <div class="section">
                <div class="card">
                    <div class="card-content">
                        <div class="row">
                            <div class="col s12">
                                <span class="card-title"><strong>Example Queries</strong></span>
                                <button @click="toggleQueryBox" class="waves-effect waves-light cyan lighten-1 btn right">
                                    <span v-show="!show_queries">Show</span>
                                    <span v-show="show_queries">Hide</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <transition name="fade">
                <div class="section" v-show="show_queries">
                    <div v-for="row of chunk" class="row">
                        <div class="col s12 m12 l4" v-for="query of row">
                            <div class="card hoverable">
                                <div class="card-content">
                                    <span class="card-title">{{query.title}}</span>
                                    <div>{{query.description}}</div>
                                </div>
                                <div class="card-action center-align">
                                    <button @click="tryQuery(query)" class="try-query waves-effect waves-light cyan lighten-1 btn">Try It!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="section">
                <div class="row">
                    <div :class="{'l6 offset-l3': map.expanded}" class="col s12 m12 l6 query-col no-overflow">
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
                                            <filter-input :data="query_builder.filter[index]" :length="query_builder.filter.length" :index="index" v-on:filterDeleted="removeFilter" event-name="filterDeleted" :name="'filter_' + index"></filter-input>
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
                                                <button @click="addFilter" class="waves-effect waves-light cyan thin-button lighten-1 btn right"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="divider"></div>
                                    <transition-group name="list" tag="div">
                                        <div class="row" :key="index" :class="{'mt-md': index == 0}" v-for="(orderby, index) in query_builder.orderby">
                                            <orderby-input v-on:orderbyDeleted="removeOrderby" event-name="orderbyDeleted" :index="index" :data="query_builder.orderby[index]" :name="'orderby_' + index"></orderby-input>
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
                                                <button @click="addOrderby" class="waves-effect waves-light btn cyan thin-button lighten-1 right"><i class="fa fa-plus" aria-hidden="true"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="divider"></div>
                                    <div class="row mt-md mb0">
                                        <div class="input-field col s4">
                                            <input type="tel" v-validate data-vv-rules="numeric" :class="{'invalid': errors.has('top')}" placeholder="100" name="top" v-model="query_builder.top" id="top">
                                            <label for="top" class="active">$top</label>
                                            <span class="error red-text darken-2" v-show="errors.has('top')">{{ errors.first('top') }}</span>
                                        </div>
                                        <div class="input-field col s4 offset-s2">
                                            <input type="tel" v-validate data-vv-rules="numeric" :class="{'invalid': errors.has('skip')}" placeholder="10" name="skip" v-model="query_builder.skip" id="skip">
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
                                        <button @click="search" class="btn waves-effect cyan lighten-1 waves-light btn" :disabled="errors.any() || query.searching">
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
                    <div :class="{'l12 big-map': map.expanded}" id="map-col" class="col s12 m12 l6">
                        <div class="card">
                            <div class="card-content">
                                <div class="row mb0">
                                    <div class="col s12">
                                        <span class="card-title">Map</span>
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
                                    <div class="col s6" :class="{'s12': !show_edit_button}">
                                        <div class="card-title">Query</div>
                                    </div>
                                    <div class="col s6" v-show="show_edit_button">
                                        <router-link v-if="server" :to="{name: 'servers.edit', params: {id: server.id}}" tag="button" class="right waves-effect cyan lighten-1 waves-light btn thin-button">Edit Server</router-link>
                                        <button v-if="!server" class="right waves-effect cyan lighten-1 waves-light btn thin-button">Edit Server</button>
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
    import FilterInput from './explorer/components/FilterInput.vue';
    import OrderbyInput from './explorer/components/OrderbyInput.vue';
    import Server from '../models/Server';
    import _ from 'lodash';
    import $ from 'jquery';
    import swal from 'sweetalert';
    import config from '../config/env';
    window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery.js');
    require('materialize-css');

    export default {//
        components: {Results, FilterInput, OrderbyInput},
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
                show_edit_button: true
            }
        },
        created() {
            let id = this.$route.params.id;

            //Server service
            this.services.server_service = new serverService();

            //Query Service
            this.services.query_service = new queryService();

            //Server from id
            Server.find(id).then((server) => {
                //Bind the server
                this.server = server;

                for(let i = 0; i < config.servers.length; i++){
                    if(config.servers[i].id === this.server.id){
                        this.show_edit_button = false;
                        break;
                    }
                }

                /**
                 * Instantiate the services
                 */
                this.services.accesstoken_service = new accessTokenSerivce(this.server);
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
            });
        },
        methods: {
            scrollToQuery() {
                $('html, body').animate({
                    scrollTop: $(".query-builder-wrapper").offset().top
                }, 400);
            },
            /**
             * Clear the query builder
             */
            clear() {
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

                this.scrollToQuery();
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
                let orderbys = this.query_builder.orderby;
                orderbys.push({
                    value: '',
                    direction: 'asc'
                });

                this.query_builder = Object.assign({}, this.query_builder, {orderby: orderbys});
            },
            /**
             * This method grabs an auth code from the authorizer if granted access
             */
            fetchAuthCode() {
                let url = serverService.openIdConnectUrl(this.server);

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

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
                        <transition name="slide">
                            <div class="section" v-show="show_queries">
                                <div v-for="row of chunk" class="row">
                                    <div class="col s12 m4" v-for="query of row">
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
                    <div class="col s12 m6">
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
                                    <div class="row" v-for="(filter, index) in query_builder.filter">
                                        <div class="valign-wrapper">
                                            <div class="col s12 m9">
                                                <div class="input-field">
                                                    <input v-validate data-rules="required" v-model="query_builder.filter[index].value" id="filter" name="filter" type="text" placeholder="ListPrice ge 100000">
                                                    <label class="active" for="filter">$filter</label>
                                                    <span class="error red-text darken-2" v-show="errors.has('filter')">{{ errors.first('filter') }}</span>
                                                </div>
                                            </div>
                                            <div class="col s12 m3">
                                                <button @click="removeFilter(index)" class="waves-effect waves-light red lighten-2 btn valign right">
                                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="input-field col s12 m4 offset-m4" v-if="(index+1) != query_builder.filter.length">
                                            <select v-model="query_builder.filter[index].join" class="browser-default">
                                                <option value=""></option>
                                                <option value="and">and</option>
                                                <option value="or">or</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col s12">
                                            <button @click="addFilter" class="waves-effect waves-light btn right"><i class="fa fa-plus left" aria-hidden="true"></i>Filter</button>
                                        </div>
                                    </div>
                                    <div class="row" v-for="(orderby, index) in query_builder.orderby">
                                        <div class="valign-wrapper">
                                            <div class="input-field col s5">
                                                <input type="text" id="orderby" name="orderby" v-model="query_builder.orderby[index].value">
                                                <label class="active" for="orderby">$orderby</label>
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
                                    <div class="row">
                                        <div class="valign-wrapper">
                                            <div class="col s7" v-show="query_builder.orderby.length < 1">
                                                <div class="card-panel center-align">
                                                    <i class="fa fa-leaf left" aria-hidden="true"></i>
                                                    <p>No orderby's added yet</p>
                                                </div>
                                            </div>
                                            <div class="col s5">
                                                <button @click="addOrderby" class="waves-effect waves-light btn right"><i class="fa fa-plus left" aria-hidden="true"></i>Orderby</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col s12 m6">
                        <div class="card">
                            <div class="card-content">
                                <span class="card-title">Map</span>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import queryService from '../services/QueryService'
    import googleMapService from '../services/GoogleMaps'
    import _ from 'lodash'
    import $ from 'jquery'

    export default {
        data() {
            return {
                query_service: null,
                map_service: null,
                example_queries: [],
                show_queries: false,
                map: null,
                query_builder: {
                    select: '',
                    filter: [],
                    orderby: []
                }
            }
        },
        mounted() {
            this.query_service = new queryService();
            this.example_queries = this.query_service.exampleQueries;
            this.map_service = new googleMapService(document.getElementById('map'), {
                center: {
                    lat: 39.9612,
                    lng: -82.9988
                },
                zoom: 10
            });

            this.map_service.load((map) => {
                this.map = map;
            });

            $(document).ready(() => {
                $('.try-query').click(() => {
                    $('html, body').animate({
                        scrollTop: $(".query-builder-wrapper").offset().top
                    }, 400);
                });
            });
        },
        methods: {
            onScroll(e, position) {
                console.log(e);
            },
            toggleQueryBox() {
                this.show_queries = !this.show_queries;
            },
            tryQuery(q) {
                this.query_builder.select = q.query.select;
                this.query_builder.filter = q.query.filter;
                this.query_builder.orderby = q.query.orderby;
            },
            removeFilter(index) {
                this.query_builder.filter.splice(index, 1);
            },
            addFilter() {
                this.query_builder.filter.push({
                    value: '',
                    join: ''
                });
            },
            removeOrderby(index){
                this.query_builder.orderby.splice(index, 1);
            },
            addOrderby(){
                this.query_builder.orderby.push({
                    value: '',
                    direction: 'asc'
                });
            }
        },
        computed: {
            chunk() {
                return _.chunk(this.example_queries, 3);
            }
        }
    }
</script>

<style lang="sass">
    #map
        height: 350px

    .map-help
        small
            font-size: 0.9em

    .slide-enter-active, .slide-leave-active
        transition: opacity .2s

    .slide-enter, .slide-leave-active
        opacity: 0
</style>

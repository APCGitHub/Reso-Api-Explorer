<template>
    <div class="breadcrumb-wrapper">
        <template v-for="(crumb, index) in crumbs">
            <router-link v-if="index < crumbs.length - 1" class="breadcrumb" tag="a" :to="crumb.url">{{crumb.name}}</router-link>
            <a href="javascript:;" class="breadcrumb" v-else>{{crumb.name}}</a>
        </template>
    </div>
</template>

<script type="text/babel">
    import BreadcrumbService from '../services/BreadcrumbService';
    window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery.js');
    require('materialize-css');

    export default {
        breadcrumbService: null,
        data () {
            return {
                crumbs: []
            }
        },
        created () {
            this.breadcrumbService = new BreadcrumbService();
        },
        mounted () {
            this.crumbs = this.breadcrumbService.build(this.$router.currentRoute);
        },
        watch: {
            $route (to, from) {
                let crumbs = this.breadcrumbService.build(to);
                this.crumbs = crumbs;
            }
        }
    }
</script>
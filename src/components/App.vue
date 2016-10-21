<template>
    <div id="wrapper">
        <div class="navbar-fixed">
            <nav class="teal">
                <div class="nav-wrapper">
                    <router-link to="/" class="brand-logo">{{siteName}}</router-link>
                    <ul class="right hide-on-med-and-down">
                        <li><router-link to="/">Home</router-link></li>
                        <li><router-link to="/login">Login</router-link></li>
                    </ul>
                </div>
            </nav>
        </div>
        <div class="container">
            <div class="row">
                <div class="col s12">
                    <router-view class="view"></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                siteName: 'RESO Explorer'
            }
        },
        methods: {

        }
    }
</script>

<style>

</style>
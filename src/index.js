import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import router from './routes'
import App from './components/App.vue'
import VeeValidate from 'vee-validate'

window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery.js')
require('materialize-css');

Vue.use(VueRouter)
Vue.use(VeeValidate);
Vue.use(VueResource);

new Vue({
    el: '#app',
    router,
    components: {App},
});
import Vue from 'vue'
import VueRouter from 'vue-router'
import router from './routes'
import App from './components/App.vue'
import $ from 'jquery'
import materialize from 'materialize-css'
import VeeValidate from 'vee-validate';

window.$ = $;

Vue.use(VueRouter)
Vue.use(VeeValidate);

new Vue({
    el: '#app',
    router,
    components: {App},
});
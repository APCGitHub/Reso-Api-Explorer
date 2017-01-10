import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import router from './routes';
import App from './components/App.vue';
import VeeValidate from 'vee-validate';

Vue.use(VueRouter)
Vue.use(VeeValidate);
Vue.use(VueResource);

new Vue({
    el: '#app',
    router,
    components: {App},
});
/**
 * Created by aclinton on 10/20/16.
 */
import VueRouter from 'vue-router';
import Login from './components/Login.vue';
import About from './components/About.vue';
import Explore from './components/Explore.vue';

const routes = [
    {path: '/', component: About},
    {path: '/login', component: Login},
    {path: '/explore', component: Explore}
];

let router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes
});

export default router;
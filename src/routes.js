/**
 * Created by aclinton on 10/20/16.
 */
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import About from './components/About.vue'
import Explore from './components/Explore.vue'
import Servers from './components/server/Index.vue'
import NewServer from './components/server/Create.vue'
import ServerEdit from './components/server/Edit.vue'

const routes = [
    {path: '/', name: 'home', component: About},
    {path: '/login', component: Login},
    {path: '/servers', name: 'servers.index', component: Servers},
    {path: '/servers/:id', name: 'servers.edit', component: ServerEdit},
    {path: '/servers/create', name: 'servers.create', component: NewServer},
    {path: '/explore/:id', name: 'explore', component: Explore}
];

let router = new VueRouter({
    linkActiveClass: 'active',
    /*mode: 'history',*/
    base: __dirname,
    routes
});

export default router;
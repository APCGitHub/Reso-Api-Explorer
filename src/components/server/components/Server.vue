<template>
	<div class="card server">
        <div class="card-content">
            <span class="card-title">
            	{{server.name}}
            	<a class="dropdown-btn clickable right" :data-activates="'server-dropdown-' + server.id">
            		<i class="fa fa-ellipsis-v"></i>

            		<ul :id="'server-dropdown-' + server.id" class="dropdown-content">
				    	<li><a @click="clearToken">Clear Token</a></li>
				  	</ul>
            	</a>
            </span>
            <p><span class="grey-text">Client ID:</span> {{server.client_id}}</p>
            <p class="mt-sm"><span @click="authHelp" class="help grey-text">Auth:</span> {{server.auth_endpoint}}</p>
            <p class="mt-sm"><span @click="tokenHelp" class="help grey-text">Token:</span> {{server.token_endpoint}}</p>
            <p class="mt-sm"><span @click="dataHelp" class="help grey-text">Data:</span> {{server.data_endpoint}}</p>
            <p class="mt-sm"><span @click="redirectUriHelp" class="help grey-text">Redirect URI</span>: {{server.redirect_uri}}</p>
        </div>
        <div class="card-action">
            <div class="row mb0">
                <div class="col s6">
                    <router-link 
                        v-if="server.access_token" 
                        :to="{name: 'explore', params: {id: server.id}}" 
                        tag="button" 
                        class="btn waves-effect waves-light cyan thin-button lighten-1">
                            <i class="fa fa-lock" aria-hidden="true"></i>&nbsp;&nbsp;Use
                    </router-link>
                    <router-link v-else
                        :to="{name: 'servers.oauth', params: {id: server.id}}" 
                        tag="button" 
                        class="btn waves-effect waves-light cyan thin-button lighten-1">
                        <i class="fa fa-lock" aria-hidden="true"></i>&nbsp;&nbsp;OAuth
                    </router-link>
                </div>
                <div class="col s6">
                    <router-link :to="{name: 'servers.edit', params: {id: server.id}}" tag="button" class="btn waves-effect waves-light cyan lighten-1 thin-button right"><i class="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;Edit</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
	window.$ = window.jQuery = require('materialize-css/node_modules/jquery/dist/jquery.js');
    require('materialize-css');

	export default {
		props: ['server'],
		data() {
			return {
				clearing_token: false
			};
		},
		mounted() {
			$('.dropdown-btn').dropdown({
				constrain_width: false,
				belowOrigin: true,
				alignment: 'right'
			});
		},
		methods: {
			clearToken() {
				this.clearing_token = true;

				this.server.update({
					access_token: ''
				}).then(res => {
					this.clearing_token = false;
				}).catch(err => {
					this.clearing_token = false;
				});
			},
			authHelp() {
	            swal({
	                title: 'Open ID Connect',
	                text: 'This is the endpoint which is used to run open id connect authentication.',
	                type: 'info'
	            });
	        },
	        tokenHelp() {
	            swal({
	                title: 'Access Token',
	                text: 'This is the endpoint which needs to be hit to grab a new access token.',
	                type: 'info'
	            });
	        },
	        dataHelp() {
	            swal({
	                title: 'Datasystem',
	                text: 'This is the url which the explorer needs to hit to grab listing data.',
	                type: 'info'
	            });
	        },
	        redirectUriHelp() {
	            swal({
	                title: 'Redirect URI',
	                text: 'This is the specific redirect url unique to this application and server.',
	                type: 'info'
	            });
	        }
		}
	}
</script>
<template>
	<div class="row mt-lg">
		<div class="col s12 m8 offset-m2">
			<div class="card">
				<div class="card-content">
					<div class="card-title" v-if="server">
					{{server.name}}
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col s12 m6">
					<div class="card">
						<div class="card-content center-align">
							<div class="card-title">Auth Code</div>
							<button :disabled="code" @click="fetchAuthCode" class="btn waves-effect waves-light cyan lighten-1"><i class="fa fa-check mr-sm" v-show="code"></i>Fetch Code</button>
						</div>
					</div>
				</div>
				<div class="col s12 m6">
					<div class="card">
						<div class="card-content center-align">
							<div class="card-title">Access Token</div>
								<button :disabled="!code || got_access_token" @click="checkIfHasSecret" class="btn waves-effect waves-light cyan lighten-1">
									<i class="fa fa-check mr-sm" v-show="got_access_token"></i>
									Fetch Access Token
								</button>
							</div>
						</div>
					</div>
				</div>	
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import ServerService from '../../services/ServerService';
	import AccessTokenService from '../../services/AccessTokenService';
	import Server from '../../models/Server';
	import Promise from 'bluebird';
	import swal from 'sweetalert';

	export default {
		serverService: null,
		accessTokenService: null,
		data() {
			return {
				server: null,
				code: null,
				got_access_token: false
			};
		},
		created() {
			let id = this.$route.params.id;

			this.serverService = new ServerService();

			Server.find(id).then(server => {
				this.server = server;
				this.accessTokenService = new AccessTokenService(this.server);

				return Promise.resolve(server);
			}).then(server => {
				if(this.$route.query.code){
					this.code = this.$route.query.code;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		methods: {
			fetchAuthCode() {
				let url = ServerService.openIdConnectUrl(this.server);

				window.location = url;
			},
			checkIfHasSecret() {
				if(this.server.client_secret){
					this.fetchAccessToken(this.server.client_secret);
				} else {
					swal({
                        title: "Credentials",
                        text: "Please supply your client_secret.",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "secret"
                    },
                    (client_secret) => {
                    	if (client_secret === false) {
                            return false;
                        }

                        if (client_secret === "") {
                            swal.showInputError("The secret is required!");
                            return false;
                        }

                    	this.fetchAccessToken(client_secret);
                    });
				}
			},
			fetchAccessToken(secret) {
				this.accessTokenService.getToken(secret, this.code).then(res => {
            		let body = res.body;
            		let expires_at = AccessTokenService.setExpiresAt(body.expires_in);

            		return this.server.update({
            			access_token: body.access_token,
                    	expires_at: expires_at
            		});
				}).then(res => {
					this.got_access_token = true;
					swal({
						title: 'Success!', 
						text: 'Successfully fetched a new access token.',
						type:'success',
						confirmButtonText: 'Continue'
					}, () => {
						this.$router.push({name: 'explore', params: {id: this.server.id}});
					});
				}).catch(err => {
					swal('Uh oh', 'There was an error while trying to fetch a new access token', 'warning');
				});
			}
		}
	}
</script>
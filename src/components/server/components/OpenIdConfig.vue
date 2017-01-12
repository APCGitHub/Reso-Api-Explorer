<template>
	<div class="row valign-wrapper">
	    <div class="col s12 m2">
	        <label for="'config.openid.' + index + '.name'" class="active">Name</label>
	        <input id="'config.openid.' + index + '.name'" name="'config.openid.' + index + '.name'" v-model="config.name">
	    </div>
	    <div class="col s12 m4 input-field">
	        <label class="active" for="'config.openid.' + index + '.key'">Key</label>
	        <input :id="'config.openid.' + index + '.key'" :name="'config.openid.' + index + '.key'" v-model="config.key">
	    </div>
	    <div class="col s12 m4 input-field">
	        <template v-if="!config.no_value">
	            <label class="active" for="'config.openid.' + index + '.value'">Value</label>
	            <input :id="'config.openid.' + index + '.value'" :name="'config.openid.' + index + '.value'" v-model="config.value">
	        </template>
	        <div v-if="config._key === 'redirect_uri'">
	        	<input v-model="config.encode" :id="'config.openid.' + index + '.checked'" :name="'config.openid.' + index + '.checked'" type="checkbox" class="filled-in">
	        	<label :for="'config.openid.' + index + '.checked'">URL Encode</label>
	        </div>
	    </div>
	    <div class="col s12 m2">
	    	<button @click="remove" v-if="!config.required" type="button" class="waves-effect waves-light thin-button red lighten-2 btn valign left">
	    		<i class="fa fa-trash"></i>
	    	</button>
	    	<button type="button" class="waves-effect waves-light thin-button cyan lighten-2 btn valign right handle">
	    		<i class="fa fa-bars" aria-hidden="true"></i>
	    	</button>
	    </div>
	</div>
</template>

<script type="text/babel">
	export default {
		props: ['config', 'index'],
		data() {
			return {}
		},
		methods: {
			remove() {
				this.$emit('remove', this.index);
			}
		}
	}
</script>
<template>
    <div class="valign-wrapper">
        <div class="input-field col s5">
            <input v-validate data-vv-rules="required" type="text" :id="name" :name="name" v-model="input_data.value">
            <label class="active" :for="name">$orderby</label>
            <span class="error red-text darken-2" v-show="errors.has(name)">{{ errors.first(name) }}</span>
        </div>
        <div class="input-field col s4">
            <select class="browser-default" v-model="input_data.direction">
                <option></option>
                <option value="asc">asc</option>
                <option valu="desc">desc</option>
            </select>
        </div>
        <div class="col s3">
            <button @click="destroy" class="waves-effect waves-light red lighten-2 btn valign right">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props: ['data', 'name', 'index', 'eventName'],
        data() {
            return {
                input_data: this.data
            }
        },
        methods: {
            destroy() {
                this.$emit(this.eventName, this.index);
            }
        }
    }
</script>
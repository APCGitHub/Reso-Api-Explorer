<template>
    <div>
        <div class="valign-wrapper">
            <div class="col s12 m9">
                <div class="input-field">
                    <input v-validate data-rules="required" :class="{'invalid': errors.has(name)}" v-model="input_data.value" :id="name" :name="name" type="text" placeholder="ListPrice ge 100000">
                    <label class="active" :for="name">$filter</label>
                    <span class="error red-text darken-2" v-show="errors.has(name)">{{ errors.first(name) }}</span>
                </div>
            </div>
            <div class="col s12 m3">
                <button @click="remove" class="waves-effect waves-light red lighten-2 btn valign right">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        <div class="input-field col s12 m4 offset-m4" v-if="(index+1) != length">
            <select name="'join_' + index" v-model="input_data.join" class="browser-default">
                <option value=""></option>
                <option value="and">and</option>
                <option value="or">or</option>
            </select>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props: ['data', 'name', 'eventName', 'index', 'length'],
        data() {
            return {
                input_data: this.data
            }
        },
        updated () {
            /**
             * NOTE: Andrew Clinton 11/21/16
             *
             * {input_data} wasn't updating when the parent updated...not sure why
             */

            this.input_data = this.data;
        },
        methods: {
            remove() {
                this.$emit(this.eventName, this.index);
            }
        }
    }
</script>
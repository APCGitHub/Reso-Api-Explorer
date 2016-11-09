<template>
    <div id="results" class="grey lighten-3"></div>
</template>

<script type="text/babel">
    import RenderJson from 'renderjson'

    export default {
        data() {
            return {
                results_div: null
            }
        },
        created() {
            RenderJson.set_show_to_level(3);
        },
        mounted() {
            this.results_div = document.getElementById('results');
        },
        props: {
            results: null
        },
        methods: {
            empty() {
                while(this.results_div.firstChild){
                    this.results_div.removeChild(this.results_div.firstChild);
                }
            }
        },
        watch: {
            results(val, oldVal) {
                if(val != oldVal){
                    this.empty();
                    if(val !== null){
                        this.results_div.appendChild(new RenderJson(this.results));
                    }
                }
            }
        }
    }
</script>

<style lang="sass">
    #results
        pre
            border: 1px solid #26a69a
            border-radius: 4px
            padding: 8px
            max-height: 500px
</style>
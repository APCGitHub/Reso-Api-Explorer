/**
 * Created by aclinton on 10/20/16.
 */
var elixir = require('laravel-elixir');

elixir(function (mix){
    mix.copy('./bower_components/materialize/fonts', 'public/fonts');
    mix.copy('./bower_components/font-awesome/fonts', 'public/fonts');
    mix.copy('public/fonts', 'build/fonts');

    mix.sass([
            'app.scss'
        ],
        './build/css/app.css');

    mix.copy('./build/css/app.css', './public/css/app.css');
});

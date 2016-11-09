/**
 * Created by aclinton on 10/20/16.
 */
var elixir = require('laravel-elixir');
var gulp = require('gulp');

gulp.task('build-config', function () {
    return gulp.src('./env.js')
        .pipe(gulp.dest('./src/config'));
});

elixir(function (mix){
    mix.task('build-config');

    mix.copy('./bower_components/materialize/fonts', './public/fonts');
    mix.copy('./bower_components/font-awesome/fonts', './public/fonts');
    mix.copy('./public/fonts', './build/fonts');

    mix.sass([
            'app.scss'
        ],
        './js/css/app.css');

    mix.copy('./public/css/app.css', './build/css/app.css');
});

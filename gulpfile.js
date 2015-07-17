var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var colors = require('colors');


gulp.task('dev', function() {
    // Start a server
    connect.server({
        root: '',
        port: 3000,
        livereload: true
    });
    console.log('[CONNECT] Listening on port 3000'.yellow.inverse);

    // Watch HTML files for changes
    console.log('[CONNECT] Watching HTML, JS and CSS files for live-reload'.blue);
    watch({
        glob: ['./src/**/*.*']
    })
        .pipe(connect.reload());
});
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css');

var paths = {
    js_sy: ['public/js/**/*.js', '!public/js/libs/*.js'],
    js_libs: ['public/js/libs/angular.min.js', 'public/js/libs/*.js', '!public/js/libs/*.map', '!public/js/libs/vivus.min.js'],
    css: 'public/css/*.css',
    watch_js: ['public/js/*'],
    watch_css: ['public/css/*']
};

// Minify all AngularJS libs
gulp.task('js_libs', function() {

    return gulp.src(paths.js_libs)
    .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('libs.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/dist'));
});

// Minify all ShinyaApp Scripts
gulp.task('js_sy', function() {

    return gulp.src(paths.js_sy)
    .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('sy.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/dist'));
});

// Minify all ShinyaApp CSS files
gulp.task('css', function () {

  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
        .pipe(minifyCSS({keepSpecialComments: 1}))
        .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('public/dist'))
})

// Rerun the task when a file changes 
// gulp.task('watch', function() {

//     gulp.watch(paths.watch_js, ['js_sy', 'js_libs']);
//     gulp.watch(paths.watch_css, ['css']);
// });

// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['js_sy', 'js_libs', 'css']);
var gulp = require('gulp');
// var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');
// var del = require('del');
 
var paths = {
  scripts: ['client/js/**/*.coffee', '!client/external/**/*.coffee'],
  images: 'client/img/**/*',
  css: 'public/css/*.css'
};
 
// Not all tasks need to use streams 
// A gulpfile is just another node program and you can use all packages available on npm 
// gulp.task('clean', function(cb) {
//   // You can use multiple globbing patterns as you would with `gulp.src` 
//   // del(['build'], cb);
// });
 
// gulp.task('scripts', ['clean'], function() {
//   // Minify and copy all JavaScript (except vendor scripts) 
//   // with sourcemaps all the way down 
//   return gulp.src(paths.scripts)
//     .pipe(sourcemaps.init())
//       .pipe(coffee())
//       .pipe(uglify())
//       .pipe(concat('all.min.js'))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('build/js'));
// });
 
// Copy all static images 
// gulp.task('images', ['clean'], function() {
//   return gulp.src(paths.images)
//     // Pass in options to the task 
//     .pipe(imagemin({optimizationLevel: 5}))
//     .pipe(gulp.dest('build/img'));
// });

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/dist/'))
})
 
// // Rerun the task when a file changes 
// gulp.task('watch', function() {
//   gulp.watch(paths.scripts, ['scripts']);
//   gulp.watch(paths.images, ['images']);
// });
 
// The default task (called when you run `gulp` from cli) 
// gulp.task('default', ['watch', 'scripts', 'images']);
gulp.task('default', ['css'])
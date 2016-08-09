////////////////////////////////
    //Setup//
////////////////////////////////

// Plugins
var gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      concat = require('gulp-concat'),
      cssnano = require('gulp-cssnano'),
      del = require('del'),
      gutil = require('gulp-util'),
      imagemin = require('gulp-imagemin'),
      pixrem = require('gulp-pixrem'),
      pjson = require('./package.json'),
      plumber = require('gulp-plumber'),
      rename = require('gulp-rename'),
      run = require('gulp-run'),
      runSequence = require('run-sequence'),
      sass = require('gulp-sass'),
      uglify = require('gulp-uglify'),
      browserSync = require('browser-sync');


// Relative paths function
var pathsConfig = function (appName) {
  this.app = "./" + (appName || pjson.name);

  return {
    app: this.app,
    templates: this.app + '/templates',
    css: this.app + '/static/css',
    sass: this.app + '/static/sass',
    fonts: this.app + '/static/fonts',
    images: this.app + '/static/images',
    js: this.app + '/static/js',
    vendor: 'bower_components/',
  }
};

var paths = pathsConfig();

////////////////////////////////
    //Tasks//
////////////////////////////////

// Styles autoprefixing and minification
gulp.task('styles', function() {
  return gulp.src(paths.sass + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber()) // Checks for errors
    .pipe(autoprefixer({browsers: ['last 2 version']})) // Adds vendor prefixes
    .pipe(pixrem())  // add fallbacks for rem units
    .pipe(gulp.dest(paths.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano()) // Minifies the result
    .pipe(gulp.dest(paths.css));
});

// Javascript minification
gulp.task('scripts', function() {
  return gulp.src(paths.js + '/project.js')
    .pipe(plumber()) // Checks for errors
    .pipe(uglify()) // Minifies the js
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js));
});

// Image compression
gulp.task('imgCompression', function(){
  return gulp.src([paths.images + '/*.jpg', paths.images + '/*.jpeg', paths.images + '/*.png', paths.images + '/*.gif'])
    .pipe(imagemin()) // Compresses PNG, JPEG, GIF
    .pipe(gulp.dest(paths.images))
});

// Run django server
gulp.task('runServer', function() {
  run('python manage.py runserver 0.0.0.0:8000').exec();
});

// Browser sync server for live reload
gulp.task('browserSync', function() {
    browserSync.init(
      [paths.css + "/*.css", paths.js + "*.js", paths.templates + '*.html'], {
        proxy:  "localhost:8000"
    });
});

// Default task
gulp.task('default', function() {
    runSequence(['styles', 'scripts', 'scripts-vendor', 'imgCompression'], 'runServer', 'browserSync');
});

// Serve task
gulp.task('serve', function() {
    runSequence(['watch']);
});
////////////////////////////////
    //Watch//
////////////////////////////////

// Watch
gulp.task('watch', ['default'], function() {
  gulp.watch(paths.sass + '/**/*.scss', ['styles']);
  gulp.watch(paths.vendor + '/**/*.scss', ['styles']);
  gulp.watch(paths.js + '/**/*.js', ['scripts']);
  gulp.watch('/bower_components/**/*', ['styles', 'scripts']);
  gulp.watch(paths.templates + "**/*.html").on('change', browserSync.reload);
});

// Javascript minification
gulp.task('scripts-vendor', function() {
  return gulp.src([
      paths.vendor + '/jquery/dist/jquery.js',
      paths.vendor + '/bootstrap-sass/assets/javascripts/bootstrap.js',
      paths.vendor + '/fullpage.js/jquery.fullPage.js'
    ])
    .pipe(plumber()) // Checks for errors
    .pipe(concat('components.js'))
    .pipe(gulp.dest(paths.js))
    .pipe(uglify()) // Minifies the js
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js));
});


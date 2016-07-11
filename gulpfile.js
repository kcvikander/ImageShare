// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var minify = require('gulp-minify');

var config = {
    //Include all js files but exclude any min.js files
	src: ['js/*.js', '!js/*.min.js', '!js/_references.js'],
	externalScripts: [
		'js/external/require.js',
		'js/external/jquery-1.10.2.min.js',
		'js/external/bootstrap.min.js',
		'js/external/react-0.14.0.min.js',
		'js/external/react-dom-0.14.0.min.js'
	],
	externalScriptsDebug: [
		'js/external/require.js',
		'js/external/jquery-1.10.2.js',
		'js/external/bootstrap.js',
		'js/external/react-0.14.0.js',
		'js/external/react-dom-0.14.0.js'
	],
    OUTPUT_DIR: 'Content/'
}

//delete the output file(s)
gulp.task('clean', function () {
    //del is an async function and not a gulp plugin (just standard nodejs)
    //It returns a promise, so make sure you return that from this task function
	//  so gulp knows when the delete is complete
	return del(['dist/*.min.js', 'dist/home.js', 'dist/screenshot.js']);
});

//Compile JSX Files
gulp.task("preprocess-jsx-home",  ['clean'], function () {
    return gulp.src("js/home.jsx")
		.pipe(babel().on('error', gutil.log))
		.pipe(browserify({ debug: true }))
		.pipe(concat('home.js'))
		.pipe(gulp.dest("js"))
		.pipe(minify())
		.pipe(concat("home.min.js"))
		.pipe(gulp.dest("js"));
});

gulp.task("preprocess-jsx-screenshot", ['clean'], function () {
	return gulp.src("js/screenshot.jsx")
		.pipe(babel().on('error', gutil.log))
		.pipe(browserify({ debug: true }))
		.pipe(concat('screenshot.js'))
		.pipe(gulp.dest("js"))
		.pipe(minify())
		.pipe(concat("screenshot.min.js"))
		.pipe(gulp.dest("js"));
});

gulp.task("compile-external", ['clean'], function () {
	return gulp.src(config.externalScriptsDebug)
      .pipe(concat('external.min.js'))
      .pipe(gulp.dest("j/"));
});

gulp.task('preprocess-jsx', ['preprocess-jsx-home', 'preprocess-jsx-screenshot'], function () { });

// Combine and minify all files from the app folder
// This tasks depends on the clean task which means gulp will ensure that the 
// Clean task is completed before running the scripts task.
gulp.task('finalize-scripts', ['preprocess-jsx', 'compile-external'], function () {});

gulp.task('watch', function () {
	gulp.watch('js/*.jsx', ['finalize-scripts']);
	// Other watchers
})

gulp.task('build', ['clean', 'finalize-scripts'], function () { });

//Set a default tasks
gulp.task('default', ['build'], function () { });
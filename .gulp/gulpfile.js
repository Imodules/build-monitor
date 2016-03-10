'use strict';

var gulp = require('gulp'),
	path = require('path'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	less = require('gulp-less'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	del = require('del'),
	bower = require('gulp-bower'),
	exec = require('child_process').exec,
	runSequence = require('run-sequence'),
	tar = require('gulp-tar'),
	gzip = require('gulp-gzip');

console.log('Starting directory: ' + process.cwd());
process.chdir('../');
console.log('New directory: ' + process.cwd());

// Just some simple help debugs.
var CodePath = './',
	InstallPath = './',
	BuildPath = './.build',

	LibPath = path.join(InstallPath, '/lib'),
	ClientPath = path.join(InstallPath, '/client'),
	PublicPath = path.join(InstallPath, '/public'),

	BowerPath = '../',

	LibBowerPath = path.join(LibPath, '/ext/bower_components'),
	ClientBowerPath = path.join(ClientPath, '/lib/ext/bower_components'),     // Where our client side libs will go that get compiled into Meteor
	ClientCompatibility = path.join(ClientPath, '/compatibility'),
	PublicBowerPath = path.join(PublicPath, '/ext/bower_components'),         // Where our public libs will go that just get loaded into the page directly
	PublicBuildBowerPath = path.join(PublicPath, '/build/bower_components');  // Where our bootstrap less files will go for compiling into public site

// Default task for the build server.
gulp.task('default', ['install.ext.dependencies']);


gulp.task('install.ext.dependencies', function (cb) {
	runSequence('clean.ext.dependencies',
		['ext.underscore.string','ext.font-awesome.animation','ext.moment.timezone'],
		cb);
});

gulp.task('ext.moment.timezone', ['bower.install'], function () {
	return gulp.src(path.join(BowerPath, '/bower_components/moment-timezone/builds/moment-timezone-with-data.js'))
		.pipe(gulp.dest(path.join(ClientBowerPath, '/moment-timezone')));
});

gulp.task('ext.underscore.string', ['bower.install'], function () {
	return gulp.src(path.join(BowerPath, '/bower_components/underscore.string/dist/underscore.string.js'))
		.pipe(gulp.dest(path.join(LibBowerPath, '/underscore.string')));
});

gulp.task('ext.font-awesome.animation', ['bower.install'], function () {
	return gulp.src(path.join(BowerPath, '/bower_components/font-awesome-animation/dist/font-awesome-animation.css'))
		.pipe(gulp.dest(path.join(ClientBowerPath, '/fa-animation')));
});

gulp.task('clean.ext.dependencies', function () {
	return del([ClientCompatibility, ClientBowerPath, PublicBowerPath, PublicBuildBowerPath, LibBowerPath]);
});

gulp.task('bower.install', ['bower.copy.json'], function () {
	return bower({cwd: BowerPath})
		.pipe(gulp.dest(path.join(BowerPath, '/bower_components')));
});

gulp.task('bower.copy.json', function () {
	// Copy {CodePath}/bower.json to {BowerPath}/bower.json
	return gulp.src(path.join(CodePath, '/bower.json'))
		.pipe(gulp.dest(BowerPath));
});

gulp.task('build', ['install.ext.dependencies','clean.build'], function (cb) {
	exec('meteor build ' + BuildPath, function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('clean.build', function () {
	return del([BuildPath]);
});

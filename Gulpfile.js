var gulp = require('gulp');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');


var tsFiles = [
	'lib/**/*.ts',
	'test/**/*.ts'
];

gulp.task('typescript', function(done) {
	var ts = require('ts-compiler');
	var bc = new ts.BatchCompiler();
	bc.on('error', function(err) {
		throw err;
	});
	bc.compile(tsFiles, { module: 'commonjs' }).done(function() {
		done();
	});
});

gulp.task('clean', function() {
	var cleanPaths = [
		'lib/**/*.js',
		'!lib/api.js',
		'test/**/*.js'
	];
	gulp.src(cleanPaths, { read: false })
		.pipe(clean());
});

gulp.task('mocha', ['clean', 'typescript'], function() {
	gulp.src('test/**/*.js')
		.pipe(mocha({ reporter: 'spec' }));
});

gulp.task('watch', function() {
	gulp.watch([
		'lib/**/*.ts',
		'lib/api.js',
		'test/**/*.ts'
	], ['mocha']);
});

gulp.task('default', ['mocha']);

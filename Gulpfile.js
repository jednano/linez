var gulp = require('gulp');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');


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
	bc.compile(tsFiles, {
		module: 'commonjs',
		target: 'ES5'
	}).done(function() {
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

gulp.task('test', function() {
	gulp.src(['test/**/*.js'], { read: false })
		.pipe(mocha({ reporter: 'spec' }))
		.on('error', function(err) {
			if (!/tests? failed/.test(err.stack)) {
				console.log(err.stack);
			}
		});
});

gulp.task('test:js', function() {
	gulp.src(['test/**/*.js'], { read: false })
		.pipe(mocha({ reporter: 'spec' }))
		.on('error', function(err) {
			if (!/tests? failed/.test(err.stack)) {
				console.log(err.stack);
			}
		});
});

gulp.task('watch', function() {
	gulp.watch(tsFiles, ['test']);
	//gulp.watch(['test/fixtures/*.txt'], ['test']);
});

gulp.task('watch:js', function() {
	gulp.watch(tsFiles.map(function(glob) {
		return glob.replace(/\.ts$/, '.js');
	}), ['test:js']);
});

gulp.task('default', ['test']);

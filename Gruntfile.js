module.exports = function(grunt) {

	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: [
			'lib/**/*.js',
			'!lib/api.js',
			'test/**/*.js'
		],
		typescript: {
			options: {
				module: 'commonjs',
				target: 'es5'
			},
			test: {
				src: 'test/**/*.ts',
				dest: ''
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					clearRequireCache: true
				},
				src: 'test/**/*.js'
			}
		},
		watch: {
			ts: {
				files: [
					'test/**/*.ts'
				],
				tasks: ['typescript']
			},
			js: {
				files: [
					'lib/api.js',
					'lib/**/*.ts',
					'test/**/*.js'
				],
				tasks: ['mochaTest']
			}
		} 
	});

	require('load-grunt-tasks')(grunt);

	// Default task(s).
	grunt.registerTask('default', ['build', 'watch']);
	grunt.registerTask('test', ['build', 'mochaTest', 'clean']);
	grunt.registerTask('build', ['clean', 'typescript']);

};

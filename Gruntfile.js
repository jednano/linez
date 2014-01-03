module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['test/**/*.js'],
		typescript: {
			base: {
				src: 'test/**/*.ts',
				dest: '',
				options: {
					module: 'commonjs',
					target: 'es5'
				}
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
					'lib/**/*.{js,ts}',
					'test/**/*.ts'
				],
				tasks: ['test']
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-typescript');

	// Default task(s).
	grunt.registerTask('default', ['test', 'watch']);
	grunt.registerTask('test', ['build', 'mochaTest']);
	grunt.registerTask('build', ['clean', 'typescript']);

};

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		mochaTest: {
			options: {
				timeout: 30000,
				reporter: 'spec',
				ignoreLeaks: false,
				globals: ['Hyperloop', 'HyperloopObject']
			},
			src: ['test/**/*_test.js'],
		},
		jshint: {
			options: {
				jshintrc: true
			},
			src: ['*.js','lib/**/*.js','test/**/*.js']
		},
		kahvesi: {
			src: ['test/**/*.js']
		},
		appcCoverage: {
			default_options: {
				src: 'coverage/lcov.info',
				force: true
			}
		},
		clean: ['tmp']
	});

	// Load grunt plugins for modules
	require('load-grunt-tasks')(grunt);

	// register tasks
	grunt.registerTask('cover', ['clean', 'kahvesi']);
	grunt.registerTask('default', ['jshint', 'mochaTest', 'clean']);
};

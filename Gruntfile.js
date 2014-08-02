module.exports = function (grunt) {
    grunt.initConfig({
        qunit: {
            all: ['tests/tests-js/index.html']
        },

        jshint: {
            all: ['Gruntfile.js', 'tests/tests-js/tests']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint', 'qunit']);
};
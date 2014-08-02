module.exports = function (grunt) {
    grunt.initConfig({
        qunit: {
            all: ['tests/tests-js/index.html']
        },

        jshint: {
            all: ['Gruntfile.js', 'tests/tests-js/tests']
        },

        concat: {
            options: {
                separator: ';'
            },
            js: {
                src: ['resources/assets/js/*.js', 'resources/assets/js/revpdf/*.js'],
                dest: 'web/assets/js/scripts.js'
            },
            css: {
                src: ['resources/assets/css/*.css'],
                dest: 'web/assets/css/styles.css'
            },
            css_cerulean: {
                src: ['resources/assets/css/*.css', 'resources/assets/css/themes/cerulean/*.css'],
                dest: 'web/assets/css/styles-cerulean.css'
            },
            css_cyborg: {
                src: ['resources/assets/css/*.css', 'resources/assets/css/themes/cyborg/*.css'],
                dest: 'web/assets/css/styles-cyborg.css'
            },
            css_journal: {
                src: ['resources/assets/css/*.css', 'resources/assets/css/themes/journal/*.css'],
                dest: 'web/assets/css/styles-journal.css'
            },
            css_slate: {
                src: ['resources/assets/css/*.css', 'resources/assets/css/themes/slate/*.css'],
                dest: 'web/assets/css/styles-slate.css'
            },
            css_spacelab: {
                src: ['resources/assets/css/*.css', 'resources/assets/css/themes/spacelab/*.css'],
                dest: 'web/assets/css/styles-spacelab.css'
            },
            css_united: {
                src: ['resources/assets/css/*.css', 'resources/assets/css/themes/united/*.css'],
                dest: 'web/assets/css/styles-united.css'
            }
        },

        uglify: {
            dist: {
                files: {
                    'web/assets/js/scripts.js': ['web/assets/js/scripts.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'qunit', 'concat:js', 'concat:css', 'concat:css_cerulean', 'concat:css_cyborg', 'concat:css_journal', 'concat:css_slate', 'concat:css_spacelab', 'concat:css_united', 'uglify']);
};
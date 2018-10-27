module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*\n** <%= pkg.name %>.js - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") + "\\n" %>' +
			'** Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
			'** Licensed <%= pkg.license %> \n*/\n\n'
        },
        jshint: {
            files: ['Gruntfile.js', '<%= pkg.name %>.js'],
            options: {
                browser: true,
                devel: true
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': [ '<%= pkg.name %>.js' ]
                }
            }
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            lib: {
				src: ['<%= pkg.name %>.js'],
				dest: 'dist/<%= pkg.name %>.js'
			},
			minLib: {
				src: ['dist/<%= pkg.name %>.min.js'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['jshint', 'uglify', 'concat']);
    // grunt.registerTask('default', ['build']);
};

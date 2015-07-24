/*jslint node: true */
"use strict";
/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	var base = grunt.option('base') || '.';
  var slidesDir = grunt.option('slidesDir');
  var formattedSlidesDir = slidesDir + '/**';
  var path = require('path');
	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://lab.hakim.se/reveal-js\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2015 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		qunit: {
			files: [ 'test/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n'
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		sass: {
			core: {
				files: {
					'css/reveal.css': 'css/reveal.scss',
				}
			},
			themes: {
				files: [
					{
						expand: true,
						cwd: 'css/theme/source',
						src: ['*.scss'],
						dest: 'css/theme',
						ext: '.css'
					}
				]
			}
		},

		autoprefixer: {
			dist: {
				src: 'css/reveal.css'
			}
		},

		cssmin: {
			compress: {
				files: {
					'css/reveal.min.css': [ 'css/reveal.css' ]
				}
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false
				}
			},
			files: [ 'Gruntfile.js', 'js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: base,
					livereload: true,
					open: true
				}
			}
		},

		compress : {
		    main : {
		        options : {
		            archive : "target/presentation.zip"
		        },
		        files : [
		            { expand: true, src : ['index.html', 'css/**', 'js/**', 'lib/**', 'resources/**', 'plugin/**'], dest: '/' },
							{ expand: true, flatten: true, src : [formattedSlidesDir], dest: '/slides' }
		        ]
		    }
		},
		watch: {
			options: {
				livereload: true
			},
			js: {
				files: [ 'Gruntfile.js', 'js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [ 'css/theme/source/*.scss', 'css/theme/template/*.scss' ],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'css/reveal.scss' ],
				tasks: 'css-core'
			},
			html: {
				files: [ 'index.html']
			}
		},
		clean: {
		   build: ["target"]
		}
	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');

	// Default task
	grunt.registerTask( 'default', [ 'css', 'js' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify', 'qunit' ] );

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'connect', 'watch' ] );

	// Run tests
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );


	grunt.registerTask( 'package', 'Assembles reveal.js with markdown slides into a zip file', function() {
	  grunt.log.writeln('slidesDir: ' + slidesDir);

		//error handling based on usage
    if((slidesDir) && (slidesDir!==true)){
			if(grunt.file.exists(slidesDir)){
			  grunt.log.writeln('Formatted slidesDir: ' + formattedSlidesDir);
				grunt.task.run('default');
				//delete target dir
		  	grunt.task.run('clean:build');
	      //create zip
	   		grunt.task.run('compress');
			}
			else{
				grunt.fail.fatal('Directory does not exist: ' + slidesDir, 3);
			}
		}
		else {
			grunt.log.errorlns('Missing parameter: --slidesDir');
			grunt.log.errorlns('Usage: grunt package --slidesDir=<PATH>/slides');

		}
	});

};

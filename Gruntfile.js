'use strict';

module.exports = function (grunt) {

  // load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['index.html'],
        ignorePath:  /\.\.\//
      },
      sass: {
        src: ['{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    compass: {
      options: {
        sassDir: 'src',
        cssDir: './',
        importPath: './bower_components'
      },
      serve: {}
    },

    connect: {
      options: {
        port: 3333,
        hostname: '0.0.0.0',
        livereload: 35731
      },
      livereload: {
        // open: true,
        middleware: function (connect) {
          return [
            connect.static('./')
            // connect().use(
            //   '/bower_components',
            //   connect.static('./bower_components')
            // )
            // connect.static(appConfig.app)
          ];
        }
      }
    },

    watch: {
      scss: {
        files: ['src/**/*.scss'],
        tasks: ['compass:serve']
      },
      // this set livereload script in index.html
      livereload: {
        files: ['index.html', 'src/**/*.js', 'main.css'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      }
    }

  })

  grunt.registerTask('serve', [
    'wiredep',
    'compass:serve',
    'connect:livereload',
    'watch'
  ]);
}

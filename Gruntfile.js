'use strict';

module.exports = function (grunt) {
  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '.jshintrc',
        'package.json',
        '**/*.js',
        '!node_modules/**/*',
        '!test/**/*'
      ]
    },

    mochacli: {
      unit: {
        options: {
          reporter: 'spec'
        }
      },
      options: {
        files: 'test/**/*.js',
        ui: 'bdd',
        colors: true
      }
    }

  });

  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['jshint', 'mochacli:unit']);
  grunt.registerTask('travis', ['jshint', 'mochacli:unit']);
  grunt.registerTask('default', 'test');

};

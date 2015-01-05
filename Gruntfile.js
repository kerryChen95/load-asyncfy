module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      test: ['./test'],
      dist: ['./dist'],
    },

    copy: {
      src: {
        expand: true,
        cwd: './src/',
        src: ['*', '**/*', '!test', '!test/*', '!test/**/*'],
        dest: './dist/',
      },
      testIndex: {
        expand: true,
        cwd: './src/test/',
        src: 'index.html',
        dest: './dist/test/',
      },
      testAsset: {
        expand: true,
        cwd: './src/test/asset/',
        src: ['*', '**/*'],
        dest: './dist/test/asset/'
      },
      jasmineCss: {
        expand: true,
        cwd: './node_modules/jasmine-core/lib/jasmine-core/',
        src: 'jasmine.css',
        dest: './src/test/',
      },
    },

    browserify: {
      options: {
        transform: [
          ['browserify-css', {
            minify: false,
          }],
        ],
        browserifyOptions: {
          // Make `this` inside a module refer to global object, instead of
          // `module.exports`
          prelude: '(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module \'"+o+"\'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(null,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})',
          debug: true,
        },
      },
      test: {
        expand: true,
        cwd: './src/test/spec/',
        src: ['./index.js'],
        dest: './dist/test/spec/',
      },
    },

    watch: {
      options: {
        interrupt: true,
        atBegin: true,
        livereloadOnError: false,
      },
      test: {
        files: ['src/*', 'src/**/*'],
        tasks: ['test'],
      },
    }
  })

  require('load-grunt-tasks')(grunt, './package.json')
  require('time-grunt')(grunt)
  grunt.registerTask('test', [
    'clean:dist',
    'copy:src',
    'copy:testAsset',
    'browserify:test',
    'copy:testIndex',
  ])
}

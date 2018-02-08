/* eslint-env node */
/* eslint camelcase: ["error", {properties: "never"}] */

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pkg = require('read-pkg').sync();

module.exports = config => {
  process.env.TEST = true;
  config.set({
    // Base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '..',
    plugins: [
      '@metahub/karma-jasmine-jquery',
      '@metahub/karma-sass-preprocessor',
      '@metahub/karma-postcss-preprocessor',
      '@metahub/karma-rollup-preprocessor',
      'karma-*',
    ],
    // Frameworks to use
    frameworks: ['jasmine-jquery'],
    // List of files / patterns to load in the browser
    files: [
      // Include, serve and watch JS and SCSS entry points
      `src/**/${pkg.name}.+(js|scss)`,
      // Include, serve and watch test entry point
      'test/main.js',
      // Serve and watch fixtures
      {pattern: 'test/fixtures/**', included: true, served: true, watched: true},
    ],
    // List of files to exclude
    exclude: ['+(src|test)/_*/**'],
    // Preprocess matching files before serving them to the browser
    preprocessors: {'+(src|test)/**/*.js': ['rollup'], '+(src|test)/**/*.scss': ['sass', 'postcss']},
    rollupPreprocessor: {
      options: Object.assign(require('../build/rollup.config.js'), {
        output: {
          name: pkg.config.module,
          globals: {
            window: 'window',
            document: 'document',
          },
          format: 'iife',
          file: `./base/src/js/${pkg.name}.js`,
          sourcemap: true,
        },
      }),
    },
    sassPreprocessor: {options: {sourceMap: true}},
    postcssPreprocessor: {options: {map: true, plugins: [autoprefixer, cssnano]}},
    // Test results reporter to use
    reporters: ['coverage', 'spec'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [{type: 'html', subdir: 'report-html'}, {type: 'json', subdir: '.'}],
    },
    specReporter: {
      suppressPassed: false,
      suppressSkipped: true,
      suppressFailed: false,
      suppressErrorSummary: false,
      showSpecTiming: true,
    },
    // Web server port
    port: 9876,
    // Enable / disable colors in the output (reporters and logs)
    colors: true,
    // Level of logging
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,
    // Enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // Start these browsers
    browsers: ['PhantomJS_Desktop'],
    customLaunchers: {PhantomJS_Desktop: {base: 'PhantomJS', options: {viewportSize: {width: 1280, height: 720}}}},
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};

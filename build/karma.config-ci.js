/* eslint-env node */

const pkg = require('read-pkg').sync();

module.exports = config => {
  const customLaunchers = require('./sauce-browsers.config.js');

  require('./karma.config.js')(config);
  config.reporters.push('saucelabs');
  config.set({
    autoWatch: false,
    sauceLabs: {
      testName: `${pkg.name} unit tests`,
      recordVideo: true,
      recordScreenshots: true,
    },
    customLaunchers,
    browsers: Object.keys(customLaunchers),
    captureTimeout: 300000,
    browserDisconnectTimeout: 180000,
    browserNoActivityTimeout: 180000,
    browserDisconnectTolerance: 8,
    concurrency: 5,
  });
};

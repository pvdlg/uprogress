/* eslint-env node */
/* eslint camelcase: ["error", {properties: "never"}] */

module.exports = {
  SL_Win_IE_10: {base: 'SauceLabs', browserName: 'internet explorer', platform: 'Windows 7', version: '10'},
  SL_Win_Edge_13: {base: 'SauceLabs', browserName: 'microsoftedge', platform: 'Windows 10', version: '13'},
  SL_Win_Edge_Latest: {base: 'SauceLabs', browserName: 'microsoftedge', platform: 'Windows 10', version: 'latest'},
  SL_Win_Firefox_16: {base: 'SauceLabs', browserName: 'firefox', platform: 'Windows 7', version: '16'},
  SL_Win_Firefox_Latest: {base: 'SauceLabs', browserName: 'firefox', platform: 'Windows 10', version: 'latest'},
  SL_Win_Chrome_26: {base: 'SauceLabs', browserName: 'chrome', platform: 'Windows 7', version: '26'},
  SL_Win_Chrome_Latest: {base: 'SauceLabs', browserName: 'chrome', platform: 'Windows 10', version: 'latest'},
  SL_OSX_Safari_7: {base: 'SauceLabs', browserName: 'safari', platform: 'OS X 10.9', version: '7'},
  SL_macOS_Safari_10: {base: 'SauceLabs', browserName: 'safari', platform: 'macOS 10.12', version: 'latest'},
  SL_iOS_8: {base: 'SauceLabs', device: 'iPhone Simulator', browserName: 'iphone', platform: 'iOS', version: '8.1'},
  SL_iOS_Latest: {
    base: 'SauceLabs',
    device: 'iPhone Simulator',
    browserName: 'iphone',
    platform: 'iOS',
    version: 'latest',
  },
  SL_Android_4: {
    base: 'SauceLabs',
    device: 'Android Emulator',
    browserName: 'android',
    platform: 'android',
    version: '4.4',
  },
  SL_Android_Latest: {
    base: 'SauceLabs',
    device: 'Android Emulator',
    browserName: 'android',
    platform: 'android',
    version: 'latest',
  },
};

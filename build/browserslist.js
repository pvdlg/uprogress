#!/usr/bin/env node

/* eslint camelcase: ["error", {properties: "never"}] */

const browserslist = require('browserslist');
const readPkg = require('read-pkg');
const sauceLabsConfig = require('./sauce-browsers.config');

const BROWSERS_LABELS = {
	ie: {label: 'Internet Explorer', saucelabs: 'internet explorer'},
	edge: {label: 'Edge', saucelabs: 'microsoftedge'},
	firefox: {label: 'Firefox', saucelabs: 'firefox'},
	chrome: {label: 'Chrome', saucelabs: 'chrome'},
	safari: {label: 'Safari', saucelabs: 'safari'},
	op_mini: {label: 'Opera Mini'},
	opera: {label: 'Opera', saucelabs: 'opera'},
	ios_saf: {label: 'iOS Safari', saucelabs: 'iphone'},
	android: {label: 'Android', saucelabs: 'android'},
	bb: {label: 'Blackberry'},
	op_mob: {label: 'Opera Mobile'},
	and_chr: {label: 'Chrome (Android)'},
	and_ff: {label: 'Firefox (Android)'},
	ie_mob: {label: 'Internet Explorer Mobile'},
	and_uc: {label: 'UC (Android)'},
	samsung: {label: 'Samsung'},
	and_qq: {label: 'QQ (Android)'},
	baidu: {label: 'Baidu'},
};

readPkg().then(pkg => {
	const supportedBrowsers = browserslist(pkg.browserslist);
	const sauceLabsBrowsers = Object.keys(sauceLabsConfig)
		.map(config => sauceLabsConfig[config])
		.reduce((acc, val) => {
			const version = `${val.version}${val.platform ? ` (${val.platform})` : ``}`;

			if (val.browserName in acc) {
				acc[val.browserName].push(version);
			} else {
				acc[val.browserName] = [version];
			}

			return acc;
		}, {});
	const browsers = supportedBrowsers
		.map(browser => browser.split(' '))
		.reduce((acc, val) => {
			if (val[0] in acc) {
				acc[val[0]].unshift(val[1]);
			} else {
				acc[val[0]] = [val[1]];
			}

			return acc;
		}, {});
	const result = {coverage: browserslist.coverage(supportedBrowsers), browsers: {}};

	for (let i = 0, keys = Object.keys(BROWSERS_LABELS), {length} = keys; i < length; i++) {
		if (keys[i] in browsers) {
			result.browsers[BROWSERS_LABELS[keys[i]].label] = {
				versions: browsers[keys[i]],
				oldest: browsers[keys[i]][0],
				tested: sauceLabsBrowsers[BROWSERS_LABELS[keys[i]].saucelabs],
			};
		}
	}

	process.stdout.write(JSON.stringify(result));
});

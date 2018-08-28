/* eslint-env node */

const pkg = require('read-pkg').sync();
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const inject = require('rollup-plugin-inject');
const {uglify} = require('rollup-plugin-uglify');
const istanbul = require('rollup-plugin-istanbul'); // eslint-disable-line import/no-unresolved
const globImport = require('rollup-plugin-glob-import');

const {MIN = false, TEST = false} = process.env;

module.exports = {
	external: ['window', 'document'],
	output: {
		globals: {window: 'window', document: 'document'},
		format: 'umd',
	},
	plugins: [
		...(TEST ? [globImport(), istanbul({include: [`src/js/${pkg.name}.js`]})] : []),
		nodeResolve(),
		commonjs({include: ['node_modules/**/*']}),
		inject({window: 'window', document: 'document'}),
		babel({
			presets: [['@babel/preset-env', {modules: false, loose: true}]],
			plugins: ['@babel/transform-object-assign'],
		}),
		MIN ? uglify({mangle: {properties: {regex: /^_/}}, output: {comments: /^!/}}) : undefined,
	].filter(Boolean),
};

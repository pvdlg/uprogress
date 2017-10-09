module.exports = {
  extends: ['pretty/jasmine', 'pretty/es6', 'pretty/prettier'],
  parserOptions: {sourceType: 'module'},
  env: {jquery: true, browser: true},
  globals: {loadFixtures: true, loadStyleFixtures: true, setFixtures: true, appendSetFixtures: true, UProgress: true},
};

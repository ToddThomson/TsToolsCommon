var path = require( 'path' );

var sourceRoot = 'src/';
var buildRoot = './built/';
var releaseRoot = './lib/';
var bundleRoot =  'bundle/'
var testRoot = 'tests/'

module.exports = {
    root: sourceRoot,
    test: testRoot,
    sourceTsConfig: sourceRoot + 'tsconfig.json',
    source: sourceRoot + '**/*.ts',
    output: buildRoot,
    main: buildRoot + sourceRoot + bundleRoot + 'TsHelpers.js',
    typings: buildRoot + sourceRoot + bundleRoot + 'TsHelpers.d.ts',
    release: releaseRoot
};

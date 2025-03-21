/* globals deps */
require('./glov/require.js');

// Node built-in replacements
deps.assert = require('assert');
deps['query-string'] = require('query-string');
// eslint-disable-next-line @stylistic/max-len
deps['source-map-cjs/lib/source-map/source-map-consumer'] = require('source-map-cjs/lib/source-map/source-map-consumer');
deps['ua-parser-js'] = require('ua-parser-js');

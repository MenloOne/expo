// Browser ES6 Polyfill
if (!global._babelPolyfill) {
  require('babel-polyfill')
}

// Start application
require('./main')

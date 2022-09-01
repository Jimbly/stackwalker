module.exports = {
  server_js_files: ['**/*.js', '!client/**/*.js'],
  all_js_files: ['**/*.js', '!client/vendor/**/*.js'],
  client_js_files: [
    '**/*.js',
    '!server/**/*.js',
    '!client/vendor/**/*.js',
  ],
  client_static: [
    'client/**/*.html',
    'client/**/*.css',
    'client/**/*.png',
    'client/**/*.ico',
  ],
  client_vendor: ['client/**/vendor/**'],
  bundles: [{
    entrypoint: 'app',
    deps: 'app_deps',
    is_worker: false,
  }],
};

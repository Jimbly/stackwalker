module.exports = function (config) {
  config.bundles = [{
    entrypoint: 'app',
    deps: 'app_deps',
    is_worker: false,
  }];
};

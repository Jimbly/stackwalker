const path = require('path');
const gb = require('glov-build');
const babel = require('glov-build-babel');
const argv = require('minimist')(process.argv.slice(2));
const appBundle = require('./app-bundle.js');
const config = require('./config.js');
const eslint = require('./eslint.js');
const exec = require('./exec.js');
const uglify = require('./uglify.js');

const targets = {
  dev: path.join(__dirname, '../dist/build.dev'),
};
const SOURCE_DIR = path.join(__dirname, '../src/');
gb.configure({
  source: SOURCE_DIR,
  statedir: path.join(__dirname, '../dist/.gbstate'),
  targets,
  log_level: gb.LOG_INFO,
});

function copy(job, done) {
  job.out(job.getFile());
  done();
}

gb.task({
  name: 'client_static',
  input: config.client_static,
  type: gb.SINGLE,
  target: 'dev',
  func: copy,
});

gb.task({
  name: 'server_js',
  input: config.server_js_files,
  target: 'dev',
  ...babel({
    babel: {
      babelrc: false,
      presets: [['@babel/env', {
        targets: {
          node: '12'
        },
        loose: true,
      }]],
    },
  }),
});

gb.task({
  name: 'eslint',
  ...eslint({
    input: config.all_js_files,
  }),
});

gb.task({
  name: 'client_js_babel_files',
  input: config.client_js_files,
  ...babel({
    sourcemap: {
      inline: true,
    },
    babel: {
      babelrc: false,
      presets: [['@babel/env', {
        targets: {
          ie: '10'
        },
        loose: true,
      }]],
      plugins: [
        // Note: Dependencies are not tracked from babel plugins, so use
        //   `webfs` instead of `static-fs` where possible
        ['static-fs', {}], // generates good code, but does not allow reloading/watchify
      ]
    }
  })
});

gb.task({
  name: 'client_js_uglify',
  input: ['client_js_babel_files:**.js'],
  ...uglify({ inline: true }, {
    compress: false,
    keep_fnames: true,
    mangle: false,
  }),
});

let bundle_tasks = [];
function registerBundle(param) {
  const { entrypoint, deps, is_worker, do_version } = param;
  let name = `client_bundle_${entrypoint.replace('/', '_')}`;
  let out = `client/${entrypoint}.bundle.js`;
  appBundle({
    name,
    source: 'client_js_uglify',
    entrypoint: `client/${entrypoint}.js`,
    out,
    deps_source: 'source',
    deps: `client/${deps}.js`,
    deps_out: is_worker ? null : `client/${deps}.bundle.js`,
    is_worker,
    target: 'dev',
    task_accum: bundle_tasks,
    do_version,
  });
}
config.bundles.forEach(registerBundle);

const server_input_globs = [
  'server_js:**',
];

let server_port = argv.port || process.env.port || 3000;

gb.task({
  name: 'run_server',
  input: server_input_globs,
  ...exec({
    cwd: '.',
    cmd: 'node',
    args: [
      argv.port ? `--inspect=${9229 + Number(argv.port) - 3000}` : '--inspect',
      'dev:server/index.js',
      '--dev',
      '--master',
    ].concat(argv.debug ? ['--debug'] : [])
    .concat(argv.env ? [`--env=${argv.env}`] : [])
    .concat(argv.port ? [`--port=${server_port}`] : []),
    stdio: 'inherit',
    // shell: true,
    // detached: true,
  }),
});

function addStarStar(a) {
  return `${a}:**`;
}

let client_tasks = [
  'client_static',
  ...bundle_tasks,
];
let client_input_globs = client_tasks.map(addStarStar);

let bs_target = `http://localhost:${server_port}`;
let bs;
gb.task({
  name: 'browser_sync',
  input: client_input_globs,
  type: gb.ALL,
  read: false,
  version: Date.now(), // always runs once per process
  init: function (next) {
    if (!bs) {
      // eslint-disable-next-line n/global-require
      bs = require('browser-sync').create();
    }
    next();
  },
  func: function (job, done) {
    let user_data = job.getUserData();
    if (!user_data.running) {
      user_data.running = true;
      // for more browser-sync config options: http://www.browsersync.io/docs/options/
      bs.init({
        // informs browser-sync to proxy our app which would run at the following location
        proxy: {
          target: bs_target,
          ws: true,
        },
        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our server
        port: 4000,

        // don't sync clicks/scrolls/forms/etc
        ghostMode: false,

        open: argv.browser === false ? false : // --no-browser
          argv.https ? 'target_https' : 'target',
      }, done);
    } else {
      let updated = job.getFilesUpdated();
      bs.reload(updated.map((a) => a.relative.replace(/^client\//, '')));
      done();
    }
  },
});

gb.task({
  name: 'build_deps',
  deps: [
    'server_js',
    ...client_tasks,
    'eslint',
  ],
});

gb.task({
  name: 'build',
  deps: ['build_deps'],
});

// Default development task
gb.task({
  name: 'default',
  deps: [
    'build_deps',
    'run_server',
    'browser_sync',
  ],
});

gb.go();

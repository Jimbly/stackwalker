/* eslint no-useless-catch:off */
const assert = require('assert');
const local_storage = require('./glov/local_storage.js');
local_storage.setStoragePrefix('stackwalker'); // Before requiring anything else that might load from this

const querystring = require('query-string');
const stack_mapper = require('../lib/stack-mapper');
const UAParser = require('ua-parser-js');

let error_report_regex = /^([^ ]+) \[([^\]]+)] "POST ([^"?]+)?([^"]+)" START "([^"]+)" "([^"]+)"$/;
let fileline_regexs = [
  /(.)([^(/:]+)\((\d+):(\d+)\)$/,
  ///(?:at ([^(]+) \(.*\/)?([^(/:]+):(\d+)(?::(\d+))?\)$/,
  /(?:at ([^(]+) \((?:.*\/)?)?([^(/:]+):(\d+)(?::(\d+))?\)$/,
  /\/*([^/@]+)\/*@.*\/([^(/:]+):(\d+)(?::(\d+))?$/,
  /()([^(/:]+):(\d+):(\d+)?$/,
];
// at Object.replaceVideoShadowStyle (<anonymous>:1:3601)

function prettyFileLine(a) {
  if (a.fn) {
    return `${a.fn} (${a.filename}:${a.line}:${a.column})`;
  } else {
    return `${a.filename}:${a.line}:${a.column}`;
  }
}

function parseIgnoreList(text) {
  let lines = text.split('\n').filter((a) => a.trim());
  return lines.map((a) => {
    if (a[0] === '/') {
      return new RegExp(a);
    } else {
      return a;
    }
  });
}

function jsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function headerFromQuery(query) {
  let header = [];
  if (query.cidx && query.cidx !== '1') {
    header.push(`CIDX=${query.cidx}`);
  }
  if (query.disconnected) {
    header.push('DISCONNECTED');
  }
  if (query.modapi_cdata) {
    header.push('MODDED');
  }
  if (query.ver) {
    if (query.build) {
      header.push(`ver=${query.build}(${query.ver})`);
    } else {
      header.push(`ver=${query.ver}`);
    }
  } else if (query.build) {
    header.push(`build=${query.build}`);
  }
  if (query.user_id) {
    header.push(`user_id=${query.user_id}`);
  }
  if (query.client_id) {
    header.push(`client_id=${query.client_id}`);
  }
  return header;
}

function header2FromQuery(query) {
  let header = [];
  if (query.webgl) {
    header.push(`WebGL${query.webgl}`);
  }
  if (query.renderer_unmasked) {
    header.push(query.renderer_unmasked);
  }
  return header;
}

function ignored(list, text) {
  if (!text) {
    return false;
  }
  for (let ii = 0; ii < list.length; ++ii) {
    if (list[ii] instanceof RegExp) {
      if (text.match(list[ii])) {
        return true;
      }
    } else if (text.indexOf(list[ii]) !== -1) {
      return true;
    }
  }
  return false;
}

function userURL(url) {
  let m = url.match(/[^?]+\/(.*)/);
  if (m) {
    return m[1];
  }
  return url;
}

let setSourcemapData;
let upload_status;
const SOURCEMAP_SERVER = 'http://localhost:3500/sourcemap/';
function autoloadSourcemap(path) {
  if (!SOURCEMAP_SERVER) {
    return;
  }
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('GET', `${SOURCEMAP_SERVER}${path}`, true);
  xhr.onload = () => {
    setSourcemapData(-1, xhr.responseText);
    upload_status.textContent = `Auto-loaded ${path}`;
  };
  xhr.onerror = () => {
    upload_status.textContent = `Error auto-loading ${path}`;
  };
  xhr.send(null);
}

let autoloaded_sourcemaps = {};
function autoloadSourcemapsForVersion(cluster, ver) {
  let key = `${cluster}#${ver}`;
  if (autoloaded_sourcemaps[key]) {
    return;
  }
  autoloaded_sourcemaps[key] = true;

  autoloadSourcemap(`${cluster}/${ver}/app.bundle.js.map`);
  autoloadSourcemap(`${cluster}/${ver}/app_deps.bundle.js.map`);
  autoloadSourcemap(`${cluster}/${ver}/worker.bundle.js.map`);
}

function cleanTimestamp(timestamp) {
  if (timestamp && timestamp.length && timestamp.length > 23 && timestamp.endsWith('Z')) {
    return `${timestamp.slice(0, 23)}Z`;
  }
  return timestamp;
}

function identity(a) {
  return a;
}

function addUAFields(parts, arr) {
  let str = arr.filter(identity).join(' ');
  if (str) {
    parts.push(str);
  }
}

function friendlyUA(ua) {
  let parts = [];
  let data = new UAParser(ua);
  let browser = data.getBrowser();
  addUAFields(parts, [browser.name, browser.version]);
  let device = data.getDevice();
  addUAFields(parts, [device.model, device.type, device.vendor]);
  let os = data.getOS();
  addUAFields(parts, [os.name, os.version]);
  parts.push(`Raw=${ua}`);

  return `UA=${parts.join(', ')}`;
}

function preparseGcloud(json, ignore_list) {
  let ret = [];
  let ignore_cidx = ignore_list.indexOf('CIDX') !== -1;
  let ignore_disconnected = ignore_list.indexOf('DISCONNECTED') !== -1;
  for (let ii = 0; ii < json.length; ++ii) {
    let record = json[ii];
    let { timestamp } = record;
    let query = record.jsonPayload;
    assert(query);
    if (query.payload) {
      query = query.payload;
    }
    if (ignored(ignore_list, query.msg)) {
      continue;
    }
    if (ignore_cidx && query.cidx && query.cidx !== '1') {
      continue;
    }
    if (ignore_disconnected && query.disconnected) {
      continue;
    }
    if ((query.build || query.ver) && record.resource?.labels?.cluster_name) {
      autoloadSourcemapsForVersion(record.resource.labels.cluster_name, query.build || query.ver);
    }
    ret.push(`${cleanTimestamp(timestamp)}${query.pos ? ` pos=${query.pos}` : ''} URL=${userURL(query.url)}`);
    if (query.platform && query.platform !== 'web') {
      ret.push(`${query.platform} ${friendlyUA(query.ua)}`);
    } else {
      ret.push(friendlyUA(query.ua));
    }
    let header = headerFromQuery(query);
    if (header.length) {
      ret.push(header.join(', '));
    }
    let header2 = header2FromQuery(query);
    if (header2.length) {
      ret.push(header2.join(', '));
    }
    if (query.file) {
      let m = query.file.match(/[^/]+$/);
      ret.push(prettyFileLine({
        filename: m && m[0],
        line: query.line,
        column: query.col,
      }));
    }
    ret = ret.concat(query.msg.split('\n'));

    ret.push('');
  }

  return ret.join('\n');
}

function preparse(text, ignore_list) {
  let json;
  if (text[0] === '[' && (json = jsonParse(text))) {
    return preparseGcloud(json, ignore_list);
  }
  let lines = text.split('\n');
  let ret = [];
  for (let ii = 0; ii < lines.length; ++ii) {
    let line = lines[ii];
    if (ignored(ignore_list, line)) {
      continue;
    }
    let m = line.match(error_report_regex);
    if (!m) {
      ret.push(line);
      continue;
    }
    // let ip = m[1];
    // let timestamp = m[2];
    // let url_start = m[3];
    let search = m[4];
    // let referrer = m[5];
    let useragent = m[6];
    let query = querystring.parse(search);
    // Source URL line
    if (query.url) {
      ret.push('');
      ret.push(`User URL=${userURL(query.url)}, UA=${useragent}`);
    }
    // Header line
    let header = headerFromQuery(query);
    if (header.length) {
      ret.push(header.join(', '));
    }
    if (query.file) {
      ret.push(prettyFileLine({
        filename: query.file.match(/[^/]+$/)[0],
        line: query.line,
        column: query.col,
      }));
    }
    ret = ret.concat(query.msg.split('\n'));
  }
  return ret.join('\n');
}

function parseStack(text, ignore_list) {
  text = preparse(text, ignore_list);
  let lines = text.split('\n');
  lines = lines.map((line) => {
    let m;
    for (let ii = 0; !m && ii < fileline_regexs.length; ++ii) {
      m = line.match(fileline_regexs[ii]);
    }
    if (m) {
      return {
        fn: m[1],
        filename: m[2],
        line: m[3],
        column: m[4] ? Number(m[4]) : undefined,
        tooltip: line,
      };
    }
    return { err: line, tooltip: line };
  });
  return lines;
}

export function main() {
  let uploads = [
    document.getElementById('upload1'),
    document.getElementById('upload2'),
    document.getElementById('upload3'),
  ];
  upload_status = document.getElementById('upload_status');
  let stack = document.getElementById('stack');
  let ignore = document.getElementById('ignore');
  let frames_bundle = document.getElementById('frames_bundle');
  let frames_source = document.getElementById('frames_source');
  let sourcecode = document.getElementById('sourcecode');
  let source_pre = document.getElementById('source_pre');
  let source_line = document.getElementById('source_line');
  let source_post = document.getElementById('source_post');
  let fileinfo = document.getElementById('fileinfo');
  let selected_line = document.getElementById('selected_line');

  let stack_data;
  let ignore_data;
  let sourcemap_data = [];
  let stackmapper = [];

  let raw_lines;
  function toOptions(list, skip_disabled) {
    raw_lines = [];
    return list.map((a) => {
      let str = a.err !== undefined ? a.err : prettyFileLine(a);
      raw_lines.push(str);
      return `<option${a.err ? ' class="disabled"' : ''}` +
        `${a.tooltip?` title="${a.tooltip.replace(/"/g, '&quot;').replace(/</g, '&lt;')}"`:''}` +
        `>${str.replace(/</g, '&lt;')}</option>`;
    }).join('\n');
  }

  let mapped_stack;

  function update() {
    // window.debugmsg('', true);
    let ignore_list = parseIgnoreList(ignore_data);
    let stack_frames = parseStack(stack_data, ignore_list);
    frames_bundle.innerHTML = toOptions(stack_frames, true);
    frames_bundle.raw_lines = raw_lines;

    mapped_stack = null;
    let any_stackmapper = false;
    for (let ii = 0; ii < stackmapper.length; ++ii) {
      if (stackmapper[ii]) {
        any_stackmapper = true;
        break;
      }
    }
    if (!any_stackmapper) {
      frames_source.innerHTML = toOptions([{ err: 'Missing sourcemap' }]);
      return;
    }
    let line_mapping = {};
    let to_process = [];
    for (let ii = 0; ii < stack_frames.length; ++ii) {
      let elem = stack_frames[ii];
      if (elem.filename && elem.line) {
        line_mapping[ii] = to_process.length;
        to_process.push({
          filename: elem.filename,
          line: elem.line,
          column: elem.column ? elem.column - 1 : undefined, // the - 1 seems to help map to the right line a lot
        });
      }
    }
    let outs = [];
    for (let ii = 0; ii < stackmapper.length; ++ii) {
      if (stackmapper[ii]) {
        outs[ii] = stackmapper[ii].map(to_process);
        for (let jj = 0; jj < outs[ii].length; ++jj) {
          assert.equal(outs[ii][jj], to_process[jj]); // this modifies in-place
        }
      }
    }
    let out_lines = [];
    mapped_stack = [];
    for (let ii = 0; ii < stack_frames.length; ++ii) {
      if (line_mapping[ii] === undefined) {
        mapped_stack.push(null);
        out_lines.push({ err: '' });
      } else {
        let mapped = to_process[line_mapping[ii]];
        mapped_stack.push(mapped);
        out_lines.push(mapped);
      }
    }
    frames_source.innerHTML = toOptions(out_lines);
    frames_source.raw_lines = raw_lines;
  }

  setSourcemapData = function (idx, text) {
    if (idx === -1) {
      idx = Math.max(3, sourcemap_data.length);
    }
    try {
      sourcemap_data[idx] = JSON.parse(text);
    } catch (e) {
      upload_status.textContent = 'Status: Error parsing Sourcemap';
      if (text.match(/error/i)) {
        upload_status.textContent += `: ${text}`;
      }
      throw e;
    }
    if (sourcemap_data[idx] && sourcemap_data[idx].version === 3) {
      upload_status.textContent = 'Status: Sourcemap loaded';
      stackmapper[idx] = stack_mapper(sourcemap_data[idx]);
      //local_storage.setJSON('sourcemap', sourcemap_data);
    } else {
      upload_status.textContent = 'Status: Error parsing Sourcemap (expected version: 3)';
    }
    update();
  };

  function looseFilenameMatch(a, b) {
    if (a.endsWith(b)) {
      let prechar = a.slice(-b.length - 1, -b.length);
      return !prechar || prechar === '/' || prechar === '\\';
    }
    return false;
  }

  function updateFocus() {
    let idx = frames_bundle.selectedIndex;
    let lineinfo = mapped_stack && mapped_stack[idx];
    if (!lineinfo) {
      source_pre.textContent = 'No source selected';
      source_line.textContent = source_post.textContent = fileinfo.textContent = '';
      return;
    }
    let { filename, line } = lineinfo;
    let any_sourcemap = false;
    for (let jj = 0; jj < sourcemap_data.length; ++jj) {
      if (!sourcemap_data[jj]) {
        continue;
      }
      any_sourcemap = true;
      let { sources, sourcesContent } = sourcemap_data[jj];
      let found = sources.indexOf(filename);
      for (let ii = 0; found === -1 && ii < sources.length; ++ii) {
        if (looseFilenameMatch(sources[ii], filename)) {
          found = ii;
        }
      }
      if (found === -1 || !sourcesContent[found]) {
        continue;
      }
      fileinfo.textContent = `File: ${filename}`;
      let lines = sourcesContent[found].split('\n');
      source_pre.textContent = lines.slice(0, line - 1).join('\n');
      source_line.textContent = lines[line - 1];
      source_post.textContent = lines.slice(line, lines.length).join('\n');
      source_line.scrollIntoView(true);
      let st = sourcecode.scrollTop;
      source_line.scrollIntoView(false);
      st += sourcecode.scrollTop;
      sourcecode.scrollTop = Math.round(st / 2);
      return;
    }
    if (!any_sourcemap) {
      source_pre.textContent = 'No sourcemap loaded';
      source_line.textContent = source_post.textContent = fileinfo.textContent = '';
    } else {
      source_pre.textContent = `Could not find ${filename} in sourcemap.sources`;
      source_line.textContent = source_post.textContent = '';
    }
  }

  uploads.forEach((elem, idx) => {
    elem.addEventListener('change', (ev) => {
      let file_to_load = elem.files[0];
      if (!file_to_load) {
        return;
      }
      let reader = new FileReader();
      local_storage.set('sourcemap', undefined);
      sourcemap_data[idx] = null;
      stackmapper[idx] = null;
      reader.onload = (loaded_event) => {
        let text = loaded_event.target.result;
        setSourcemapData(idx, text);
      };

      reader.readAsText(file_to_load, 'UTF-8');
    });
  });

  function onStackChange(ev) {
    if (ev.target.value.startsWith('(loaded ')) {
      // ignore, leave stack_data
    } else {
      stack_data = ev.target.value;
      local_storage.set('stack', stack_data);
      update();
    }
  }
  stack.addEventListener('textInput', (ev) => {
    let text = ev.data;
    if (text.length > 10000) {
      // large paste, just store the data but don't add it to the DOM
      stack_data = text;
      ev.target.value = `(loaded ${text.length} bytes)`;
      ev.preventDefault();
      update();
    }
  });
  stack.addEventListener('change', onStackChange);
  stack.addEventListener('input', onStackChange);
  stack.value = stack_data = local_storage.get('stack') || '';

  function onIgnoreChange(ev) {
    ignore_data = ev.target.value;
    local_storage.set('ignore', ignore_data);
    update();
  }
  ignore.addEventListener('change', onIgnoreChange);
  ignore.addEventListener('input', onIgnoreChange);
  ignore.value = ignore_data = local_storage.get('ignore') || '';

  function onFramesChange(ev) {
    let idx = ev.target.selectedIndex;
    if (frames_bundle.selectedIndex !== idx) {
      frames_bundle.selectedIndex = idx;
    }
    if (frames_source.selectedIndex !== idx) {
      frames_source.selectedIndex = idx;
    }
    updateFocus();
  }
  frames_bundle.addEventListener('change', onFramesChange);
  //frames_bundle.addEventListener('input', onFramesChange);
  frames_source.addEventListener('change', onFramesChange);
  //frames_source.addEventListener('input', onFramesChange);
  frames_bundle.addEventListener('change', (ev) => {
    selected_line.value = frames_bundle.raw_lines[ev.target.selectedIndex];
  });
  frames_source.addEventListener('change', (ev) => {
    selected_line.value = frames_source.raw_lines[ev.target.selectedIndex];
  });

  //sourcemap_data = local_storage.getJSON('sourcemap');
  if (sourcemap_data[0] && sourcemap_data[0].version === 3) {
    upload_status.textContent = 'Status: Sourcemap loaded from local storage';
  }

  // Sync scroll areas
  let scroll_locked_source = 0;
  let scroll_locked_bundle = 0;
  frames_source.addEventListener('scroll', () => {
    if (Date.now() < scroll_locked_source) {
      return;
    }
    scroll_locked_bundle = Date.now() + 400;
    frames_bundle.scrollTop = frames_source.scrollTop;
  });
  frames_bundle.addEventListener('scroll', () => {
    if (Date.now() < scroll_locked_bundle) {
      return;
    }
    scroll_locked_source = Date.now() + 400;
    frames_source.scrollTop = frames_bundle.scrollTop;
  });

  update();
}

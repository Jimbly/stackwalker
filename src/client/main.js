/* eslint no-useless-catch:off */
const local_storage = require('./glov/local_storage.js');
local_storage.storage_prefix = 'stackwalker';

const querystring = require('query-string');
const stack_mapper = require('stack-mapper');

let error_report_regex = /^([^ ]+) \[([^\]]+)] "POST ([^"?]+)?([^"]+)" START "([^"]+)" "([^"]+)"$/;
let fileline_regex1 = /(.)([^(/:]+)\((\d+):(\d+)\)$/;
let fileline_regex2 = /(?:at ([^(]+) \(.*\/)?([^(/:]+):(\d+)(?::(\d+))?\)$/;

function prettyFileLine(a) {
  return `${a.fn || ''} (${a.filename}:${a.line}:${a.column})`;
}

function preparse(text) {
  let lines = text.split('\n');
  let ret = [];
  for (let ii = 0; ii < lines.length; ++ii) {
    let line = lines[ii];
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
      ret.push(`User URL=${query.url}, UA=${useragent}`);
    }
    // Header line
    let header = [];
    if (query.cidx && query.cidx !== '1') {
      header.push(`CIDX=${query.cidx}`);
    }
    if (query.ver) {
      header.push(`ver=${query.ver}`);
    }
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

function parseStack(text) {
  text = preparse(text);
  let lines = text.split('\n');
  lines = lines.map((line) => {
    let m = line.match(fileline_regex1) || line.match(fileline_regex2);
    if (m) {
      return {
        fn: m[1],
        filename: m[2],
        line: m[3],
        column: m[4] ? Number(m[4]) - 1 : undefined, // the - 1 seems to help in some cases
        tooltip: line,
      };
    }
    return { err: line, tooltip: line };
  });
  return lines;
}

export function main() {
  let upload = document.getElementById('upload');
  let upload_status = document.getElementById('upload_status');
  let stack = document.getElementById('stack');
  let frames_bundle = document.getElementById('frames_bundle');
  let frames_source = document.getElementById('frames_source');
  let sourcecode = document.getElementById('sourcecode');
  let source_pre = document.getElementById('source_pre');
  let source_line = document.getElementById('source_line');
  let source_post = document.getElementById('source_post');

  let stack_data;
  let sourcemap_data;
  let stackmapper;

  function toOptions(list) {
    return list.map((a) => {
      let str = a.err !== undefined ? a.err : prettyFileLine(a);
      return `<option${a.err ? ' disabled' : ''}` +
        `${a.tooltip?` title="${a.tooltip.replace(/"/g, '&quot;')}"`:''}` +
        `>${str}</option>`;
    }).join('\n');
  }

  let mapped_stack;

  function update() {
    // window.debugmsg('', true);
    let stack_frames = parseStack(stack_data);
    frames_bundle.innerHTML = toOptions(stack_frames);

    mapped_stack = null;
    if (!stackmapper) {
      frames_source.innerHTML = toOptions([{ err: 'Missing sourcemap' }]);
      return;
    }
    let line_mapping = {};
    let to_process = [];
    for (let ii = 0; ii < stack_frames.length; ++ii) {
      let elem = stack_frames[ii];
      if (elem.filename) {
        line_mapping[ii] = to_process.length;
        to_process.push(elem);
      }
    }
    let out = stackmapper.map(to_process);
    let out_lines = [];
    mapped_stack = [];
    for (let ii = 0; ii < stack_frames.length; ++ii) {
      if (line_mapping[ii] === undefined) {
        mapped_stack.push(null);
        out_lines.push({ err: '' });
      } else {
        mapped_stack.push(out[line_mapping[ii]]);
        out_lines.push(out[line_mapping[ii]]);
      }
    }
    frames_source.innerHTML = toOptions(out_lines);
  }

  function updateFocus() {
    let idx = frames_bundle.selectedIndex;
    let lineinfo = mapped_stack && mapped_stack[idx];
    if (!sourcemap_data) {
      source_pre.textContent = 'No sourcemap loaded';
      source_line.textContent = source_post.textContent = '';
      return;
    }
    if (!lineinfo) {
      source_pre.textContent = 'No source selected';
      source_line.textContent = source_post.textContent = '';
      return;
    }
    let { sources, sourcesContent } = sourcemap_data;
    let { filename, line } = lineinfo;
    let found = -1;
    for (let ii = 0; ii < sources.length; ++ii) {
      if (sources[ii].endsWith(filename)) {
        found = ii;
      }
    }
    if (found === -1 || !sourcesContent[found]) {
      source_pre.textContent = `Could not find ${filename} in sourcemap.sources`;
      source_line.textContent = source_post.textContent = '';
      return;
    }
    let lines = sourcesContent[found].split('\n');
    source_pre.textContent = lines.slice(0, line - 1).join('\n');
    source_line.textContent = lines[line - 1];
    source_post.textContent = lines.slice(line, lines.length).join('\n');
    source_line.scrollIntoView(true);
    let st = sourcecode.scrollTop;
    source_line.scrollIntoView(false);
    st += sourcecode.scrollTop;
    sourcecode.scrollTop = Math.round(st / 2);
  }

  upload.addEventListener('change', (ev) => {
    let file_to_load = upload.files[0];
    let reader = new FileReader();
    local_storage.set('sourcemap', undefined);
    sourcemap_data = null;
    stackmapper = null;
    reader.onload = (loaded_event) => {
      let text = loaded_event.target.result;
      try {
        sourcemap_data = JSON.parse(text);
      } catch (e) {
        upload_status.textContent = 'Status: Error parsing Sourcemap';
        throw e;
      }
      if (sourcemap_data && sourcemap_data.version === 3) {
        upload_status.textContent = 'Status: Sourcemap loaded';
        stackmapper = stack_mapper(sourcemap_data);
        //local_storage.setJSON('sourcemap', sourcemap_data);
      } else {
        upload_status.textContent = 'Status: Error parsing Sourcemap (expected version: 3)';
      }
      update();
    };

    reader.readAsText(file_to_load, 'UTF-8');
  });

  function onStackChange(ev) {
    stack_data = ev.target.value;
    local_storage.set('stack', stack_data);
    update();
  }
  stack.addEventListener('change', onStackChange);
  stack.addEventListener('input', onStackChange);
  stack.value = stack_data = local_storage.get('stack') || '';

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

  //sourcemap_data = local_storage.getJSON('sourcemap');
  if (sourcemap_data && sourcemap_data.version === 3) {
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

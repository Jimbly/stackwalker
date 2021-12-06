(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var called_once=false;window.onload=function(){if(called_once){return}called_once=true;require("./glov/bootstrap.js");require("./main.js").main()};

},{"./glov/bootstrap.js":2,"./main.js":5}],2:[function(require,module,exports){
"use strict";require("./polyfill.js");var debug=document.getElementById("debug");window.onerror=function(e,file,line,col,errorobj){var msg=e+"\n  at "+file+"("+line+":"+col+")";if(errorobj&&errorobj.stack){msg=""+errorobj.stack;if(errorobj.message){if(msg.indexOf(errorobj.message)===-1){msg=errorobj.message+"\n"+msg}}var origin=document.location.origin||"";if(origin){if(origin.slice(-1)!=="/"){origin+="/"}msg=msg.split(origin).join("")}msg=msg.replace(/\[\d+\]</g,"").replace(/<?\/<?/g,"/").replace(/\n([^ ])/g,"\n  $1")}var show=true;if(window.glov_error_report){show=window.glov_error_report(msg,file,line,col)}if(show){debug.innerText=msg+"\n\nPlease report this error to the developer, and then reload this page."}};window.debugmsg=function(msg,clear){if(clear){debug.innerText=msg}else{debug.innerText+=msg+"\n"}};

},{"./polyfill.js":4}],3:[function(require,module,exports){
"use strict";exports.__esModule=true;exports.setStoragePrefix=setStoragePrefix;exports.getStoragePrefix=getStoragePrefix;exports.get=get;exports.set=set;exports.setJSON=setJSON;exports.getJSON=getJSON;exports.clearAll=clearAll;exports.exportAll=exportAll;exports.importAll=importAll;var storage_prefix="demo";var is_set=false;function setStoragePrefix(prefix){if(is_set){return}is_set=true;storage_prefix=prefix}function getStoragePrefix(){return storage_prefix}var lsd=function(){try{localStorage.test="test";return localStorage}catch(e){return{}}}();function get(key){key=storage_prefix+"_"+key;var ret=lsd[key];if(ret==="undefined"){ret=undefined}return ret}function set(key,value){key=storage_prefix+"_"+key;if(value===undefined||value===null){delete lsd[key]}else{lsd[key]=value}}function setJSON(key,value){set(key,JSON.stringify(value))}function getJSON(key,def){var value=get(key);if(value===undefined){return def}try{return JSON.parse(value)}catch(e){}return def}function clearAll(key_prefix){var prefix=new RegExp("^"+storage_prefix+"_"+(key_prefix||""),"u");for(var key in lsd){if(key.match(prefix)){delete lsd[key]}}}function exportAll(){var obj={};var prefix=new RegExp("^"+storage_prefix+"_(.*)","u");for(var key in lsd){var m=key.match(prefix);if(m){var v=lsd[key];if(v&&v!=="undefined"){obj[m[1]]=v}}}return JSON.stringify(obj)}function importAll(serialized){var obj=JSON.parse(serialized);clearAll();for(var key in obj){set(key,obj[key])}}

},{}],4:[function(require,module,exports){
"use strict";var typedarrays=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array];if(!Uint8Array.prototype.slice){typedarrays.forEach(function(ArrayType){Object.defineProperty(ArrayType.prototype,"slice",{value:function value(begin,end){if(end===undefined){end=this.length}if(end<0){end=this.length-end}begin=begin||0;if(begin>=this.length){begin=this.length-1}if(end>this.length){end=this.length}if(end<begin){end=begin}var len=end-begin;var ret=new ArrayType(len);for(var ii=0;ii<len;++ii){ret[ii]=this[begin+ii]}return ret}})})}function cmpDefault(a,b){return a-b}var replacements={join:function join(delim){return Array.prototype.join.call(this,delim)},fill:function fill(value,begin,end){if(end===undefined){end=this.length}for(var ii=begin||0;ii<end;++ii){this[ii]=value}return this},sort:function sort(cmp){Array.prototype.sort.call(this,cmp||cmpDefault)}};var _loop=function _loop(key){if(!Uint8Array.prototype[key]){typedarrays.forEach(function(ArrayType){Object.defineProperty(ArrayType.prototype,key,{value:replacements[key]})})}};for(var key in replacements){_loop(key)}if(!String.prototype.endsWith){Object.defineProperty(String.prototype,"endsWith",{value:function value(test){return this.slice(-test.length)===test}});Object.defineProperty(String.prototype,"startsWith",{value:function value(test){return this.slice(0,test.length)===test}})}

},{}],5:[function(require,module,exports){
"use strict";exports.__esModule=true;exports.main=main;var assert=require("assert");var local_storage=require("./glov/local_storage.js");local_storage.setStoragePrefix("stackwalker");var querystring=require("query-string");var stack_mapper=require("../lib/stack-mapper/index.js");var UAParser=require("ua-parser-js");var error_report_regex=/^([^ ]+) \[([^\]]+)] "POST ([^"?]+)?([^"]+)" START "([^"]+)" "([^"]+)"$/;var fileline_regexs=[/(.)([^(/:]+)\((\d+):(\d+)\)$/,/(?:at ([^(]+) \((?:.*\/)?)?([^(/:]+):(\d+)(?::(\d+))?\)$/,/\/*([^/@]+)\/*@.*\/([^(/:]+):(\d+)(?::(\d+))?$/,/()([^(/:]+):(\d+):(\d+)?$/];function prettyFileLine(a){if(a.fn){return a.fn+" ("+a.filename+":"+a.line+":"+a.column+")"}else{return a.filename+":"+a.line+":"+a.column}}function parseIgnoreList(text){var lines=text.split("\n").filter(function(a){return a.trim()});return lines.map(function(a){if(a[0]==="/"){return new RegExp(a)}else{return a}})}function jsonParse(text){try{return JSON.parse(text)}catch(e){return null}}function headerFromQuery(query){var header=[];if(query.cidx&&query.cidx!=="1"){header.push("CIDX="+query.cidx)}if(query.disconnected){header.push("DISCONNECTED")}if(query.modapi_cdata){header.push("MODDED")}if(query.ver){if(query.build){header.push("ver="+query.build+"("+query.ver+")")}else{header.push("ver="+query.ver)}}else if(query.build){header.push("build="+query.build)}if(query.user_id){header.push("user_id="+query.user_id)}if(query.client_id){header.push("client_id="+query.client_id)}return header}function header2FromQuery(query){var header=[];if(query.webgl){header.push("WebGL"+query.webgl)}if(query.renderer_unmasked){header.push(query.renderer_unmasked)}return header}function ignored(list,text){if(!text){return false}for(var ii=0;ii<list.length;++ii){if(list[ii]instanceof RegExp){if(text.match(list[ii])){return true}}else if(text.indexOf(list[ii])!==-1){return true}}return false}function userURL(url){var m=url.match(/[^?]+\/(.*)/);if(m){return m[1]}return url}var setSourcemapData;var upload_status;var SOURCEMAP_SERVER="http://localhost:3500/sourcemap/";function autoloadSourcemap(path){if(!SOURCEMAP_SERVER){return}var xhr=new XMLHttpRequest;xhr.withCredentials=false;xhr.open("GET",""+SOURCEMAP_SERVER+path,true);xhr.onload=function(){setSourcemapData(-1,xhr.responseText);upload_status.textContent="Auto-loaded "+path};xhr.onerror=function(){upload_status.textContent="Error auto-loading "+path};xhr.send(null)}var autoloaded_sourcemaps={};function autoloadSourcemapsForVersion(cluster,ver){var key=cluster+"#"+ver;if(autoloaded_sourcemaps[key]){return}autoloaded_sourcemaps[key]=true;autoloadSourcemap(cluster+"/"+ver+"/app.bundle.js.map");autoloadSourcemap(cluster+"/"+ver+"/app_deps.bundle.js.map");autoloadSourcemap(cluster+"/"+ver+"/worker.bundle.js.map")}function cleanTimestamp(timestamp){if(timestamp&&timestamp.length&&timestamp.length>23&&timestamp.endsWith("Z")){return timestamp.slice(0,23)+"Z"}return timestamp}function identity(a){return a}function addUAFields(parts,arr){var str=arr.filter(identity).join(" ");if(str){parts.push(str)}}function friendlyUA(ua){var parts=[];var data=new UAParser(ua);var browser=data.getBrowser();addUAFields(parts,[browser.name,browser.version]);var device=data.getDevice();addUAFields(parts,[device.model,device.type,device.vendor]);var os=data.getOS();addUAFields(parts,[os.name,os.version]);parts.push("Raw="+ua);return"UA="+parts.join(", ")}function preparseGcloud(json,ignore_list){var ret=[];var ignore_cidx=ignore_list.indexOf("CIDX")!==-1;var ignore_disconnected=ignore_list.indexOf("DISCONNECTED")!==-1;for(var ii=0;ii<json.length;++ii){var _record$resource,_record$resource$labe;var record=json[ii];var timestamp=record.timestamp;var query=record.jsonPayload;assert(query);if(query.payload){query=query.payload}if(ignored(ignore_list,query.msg)){continue}if(ignore_cidx&&query.cidx&&query.cidx!=="1"){continue}if(ignore_disconnected&&query.disconnected){continue}if((query.build||query.ver)&&((_record$resource=record.resource)==null?void 0:(_record$resource$labe=_record$resource.labels)==null?void 0:_record$resource$labe.cluster_name)){autoloadSourcemapsForVersion(record.resource.labels.cluster_name,query.build||query.ver)}ret.push(""+cleanTimestamp(timestamp)+(query.pos?" pos="+query.pos:"")+" URL="+userURL(query.url));if(query.platform&&query.platform!=="web"){ret.push(query.platform+" "+friendlyUA(query.ua))}else{ret.push(friendlyUA(query.ua))}var header=headerFromQuery(query);if(header.length){ret.push(header.join(", "))}var header2=header2FromQuery(query);if(header2.length){ret.push(header2.join(", "))}if(query.file){var m=query.file.match(/[^/]+$/);ret.push(prettyFileLine({filename:m&&m[0],line:query.line,column:query.col}))}ret=ret.concat(query.msg.split("\n"));ret.push("")}return ret.join("\n")}function preparse(text,ignore_list){var json;if(text[0]==="["&&(json=jsonParse(text))){return preparseGcloud(json,ignore_list)}var lines=text.split("\n");var ret=[];for(var ii=0;ii<lines.length;++ii){var line=lines[ii];if(ignored(ignore_list,line)){continue}var m=line.match(error_report_regex);if(!m){ret.push(line);continue}var search=m[4];var useragent=m[6];var query=querystring.parse(search);if(query.url){ret.push("");ret.push("User URL="+userURL(query.url)+", UA="+useragent)}var header=headerFromQuery(query);if(header.length){ret.push(header.join(", "))}if(query.file){ret.push(prettyFileLine({filename:query.file.match(/[^/]+$/)[0],line:query.line,column:query.col}))}ret=ret.concat(query.msg.split("\n"))}return ret.join("\n")}function parseStack(text,ignore_list){text=preparse(text,ignore_list);var lines=text.split("\n");lines=lines.map(function(line){var m;for(var ii=0;!m&&ii<fileline_regexs.length;++ii){m=line.match(fileline_regexs[ii])}if(m){return{fn:m[1],filename:m[2],line:m[3],column:m[4]?Number(m[4]):undefined,tooltip:line}}return{err:line,tooltip:line}});return lines}function main(){var uploads=[document.getElementById("upload1"),document.getElementById("upload2"),document.getElementById("upload3")];upload_status=document.getElementById("upload_status");var stack=document.getElementById("stack");var ignore=document.getElementById("ignore");var frames_bundle=document.getElementById("frames_bundle");var frames_source=document.getElementById("frames_source");var sourcecode=document.getElementById("sourcecode");var source_pre=document.getElementById("source_pre");var source_line=document.getElementById("source_line");var source_post=document.getElementById("source_post");var fileinfo=document.getElementById("fileinfo");var selected_line=document.getElementById("selected_line");var stack_data;var ignore_data;var sourcemap_data=[];var stackmapper=[];var raw_lines;function toOptions(list,skip_disabled){raw_lines=[];return list.map(function(a){var str=a.err!==undefined?a.err:prettyFileLine(a);raw_lines.push(str);return"<option"+(a.err?' class="disabled"':"")+(""+(a.tooltip?' title="'+a.tooltip.replace(/"/g,"&quot;").replace(/</g,"&lt;")+'"':""))+(">"+str.replace(/</g,"&lt;")+"</option>")}).join("\n")}var mapped_stack;function update(){var ignore_list=parseIgnoreList(ignore_data);var stack_frames=parseStack(stack_data,ignore_list);frames_bundle.innerHTML=toOptions(stack_frames,true);frames_bundle.raw_lines=raw_lines;mapped_stack=null;var any_stackmapper=false;for(var ii=0;ii<stackmapper.length;++ii){if(stackmapper[ii]){any_stackmapper=true;break}}if(!any_stackmapper){frames_source.innerHTML=toOptions([{err:"Missing sourcemap"}]);return}var line_mapping={};var to_process=[];for(var _ii=0;_ii<stack_frames.length;++_ii){var elem=stack_frames[_ii];if(elem.filename&&elem.line){line_mapping[_ii]=to_process.length;to_process.push({filename:elem.filename,line:elem.line,column:elem.column?elem.column-1:undefined})}}var outs=[];for(var _ii2=0;_ii2<stackmapper.length;++_ii2){if(stackmapper[_ii2]){outs[_ii2]=stackmapper[_ii2].map(to_process);for(var jj=0;jj<outs[_ii2].length;++jj){assert.equal(outs[_ii2][jj],to_process[jj])}}}var out_lines=[];mapped_stack=[];for(var _ii3=0;_ii3<stack_frames.length;++_ii3){if(line_mapping[_ii3]===undefined){mapped_stack.push(null);out_lines.push({err:""})}else{var mapped=to_process[line_mapping[_ii3]];mapped_stack.push(mapped);out_lines.push(mapped)}}frames_source.innerHTML=toOptions(out_lines);frames_source.raw_lines=raw_lines}setSourcemapData=function setSourcemapData(idx,text){if(idx===-1){idx=Math.max(3,sourcemap_data.length)}try{sourcemap_data[idx]=JSON.parse(text)}catch(e){upload_status.textContent="Status: Error parsing Sourcemap";if(text.match(/error/i)){upload_status.textContent+=": "+text}throw e}if(sourcemap_data[idx]&&sourcemap_data[idx].version===3){upload_status.textContent="Status: Sourcemap loaded";stackmapper[idx]=stack_mapper(sourcemap_data[idx])}else{upload_status.textContent="Status: Error parsing Sourcemap (expected version: 3)"}update()};function looseFilenameMatch(a,b){if(a.endsWith(b)){var prechar=a.slice(-b.length-1,-b.length);return!prechar||prechar==="/"||prechar==="\\"}return false}function updateFocus(){var idx=frames_bundle.selectedIndex;var lineinfo=mapped_stack&&mapped_stack[idx];if(!lineinfo){source_pre.textContent="No source selected";source_line.textContent=source_post.textContent=fileinfo.textContent="";return}var filename=lineinfo.filename,line=lineinfo.line;var any_sourcemap=false;for(var jj=0;jj<sourcemap_data.length;++jj){if(!sourcemap_data[jj]){continue}any_sourcemap=true;var _sourcemap_data$jj=sourcemap_data[jj],sources=_sourcemap_data$jj.sources,sourcesContent=_sourcemap_data$jj.sourcesContent;var found=sources.indexOf(filename);for(var ii=0;found===-1&&ii<sources.length;++ii){if(looseFilenameMatch(sources[ii],filename)){found=ii}}if(found===-1||!sourcesContent[found]){continue}fileinfo.textContent="File: "+filename;var lines=sourcesContent[found].split("\n");source_pre.textContent=lines.slice(0,line-1).join("\n");source_line.textContent=lines[line-1];source_post.textContent=lines.slice(line,lines.length).join("\n");source_line.scrollIntoView(true);var st=sourcecode.scrollTop;source_line.scrollIntoView(false);st+=sourcecode.scrollTop;sourcecode.scrollTop=Math.round(st/2);return}if(!any_sourcemap){source_pre.textContent="No sourcemap loaded";source_line.textContent=source_post.textContent=fileinfo.textContent=""}else{source_pre.textContent="Could not find "+filename+" in sourcemap.sources";source_line.textContent=source_post.textContent=""}}uploads.forEach(function(elem,idx){elem.addEventListener("change",function(ev){var file_to_load=elem.files[0];if(!file_to_load){return}var reader=new FileReader;local_storage.set("sourcemap",undefined);sourcemap_data[idx]=null;stackmapper[idx]=null;reader.onload=function(loaded_event){var text=loaded_event.target.result;setSourcemapData(idx,text)};reader.readAsText(file_to_load,"UTF-8")})});function onStackChange(ev){if(ev.target.value.startsWith("(loaded ")){}else{stack_data=ev.target.value;local_storage.set("stack",stack_data);update()}}stack.addEventListener("textInput",function(ev){var text=ev.data;if(text.length>1e4){stack_data=text;ev.target.value="(loaded "+text.length+" bytes)";ev.preventDefault();update()}});stack.addEventListener("change",onStackChange);stack.addEventListener("input",onStackChange);stack.value=stack_data=local_storage.get("stack")||"";function onIgnoreChange(ev){ignore_data=ev.target.value;local_storage.set("ignore",ignore_data);update()}ignore.addEventListener("change",onIgnoreChange);ignore.addEventListener("input",onIgnoreChange);ignore.value=ignore_data=local_storage.get("ignore")||"";function onFramesChange(ev){var idx=ev.target.selectedIndex;if(frames_bundle.selectedIndex!==idx){frames_bundle.selectedIndex=idx}if(frames_source.selectedIndex!==idx){frames_source.selectedIndex=idx}updateFocus()}frames_bundle.addEventListener("change",onFramesChange);frames_source.addEventListener("change",onFramesChange);frames_bundle.addEventListener("change",function(ev){selected_line.value=frames_bundle.raw_lines[ev.target.selectedIndex]});frames_source.addEventListener("change",function(ev){selected_line.value=frames_source.raw_lines[ev.target.selectedIndex]});if(sourcemap_data[0]&&sourcemap_data[0].version===3){upload_status.textContent="Status: Sourcemap loaded from local storage"}var scroll_locked_source=0;var scroll_locked_bundle=0;frames_source.addEventListener("scroll",function(){if(Date.now()<scroll_locked_source){return}scroll_locked_bundle=Date.now()+400;frames_bundle.scrollTop=frames_source.scrollTop});frames_bundle.addEventListener("scroll",function(){if(Date.now()<scroll_locked_bundle){return}scroll_locked_source=Date.now()+400;frames_source.scrollTop=frames_bundle.scrollTop});update()}

},{"../lib/stack-mapper/index.js":6,"./glov/local_storage.js":3,"assert":undefined,"query-string":undefined,"ua-parser-js":undefined}],6:[function(require,module,exports){
"use strict";var setupConsumer=require("./lib/setup-consumer.js");module.exports=function stackMapper(sourcemap){return new StackMapper(sourcemap)};var proto=StackMapper.prototype;function filter(arr,fn){var matches=[];for(var i=0;i<arr.length;i++){if(fn(arr[i]))matches.push(arr[i])}return matches}function StackMapper(sourcemap){if(!(this instanceof StackMapper))return new StackMapper(sourcemap);if(typeof sourcemap!=="object")throw new Error("sourcemap needs to be an object, please use convert-source-map module to convert it from any other format\n"+"See: https://github.com/thlorenz/stack-mapper#obtaining-the-source-map");this._sourcemap=sourcemap;this._prepared=false}proto._prepare=function(){var prepped=setupConsumer(this._sourcemap);this._originalPosition=prepped.originalPosition;this._prepared=true};proto._mapStack=function(stack){var self=this;var generatedFile=self._sourcemap.file;var re=new RegExp(generatedFile+"$");for(var i=0;i<stack.length;i++){var frame=stack[i];if(!re.test(frame.filename)){continue}var orig=self._originalPosition(frame.line,frame.column);frame.filename=orig.source;frame.line=orig.line;if(!(orig.source&&orig.source.slice(-3)===".js"&&orig.column===0&&frame.column>0)){frame.column=orig.column}}};proto.map=function(stack){if(!this._prepared)this._prepare();var adapted=[].concat(stack);this._mapStack(adapted);return adapted};

},{"./lib/setup-consumer.js":7}],7:[function(require,module,exports){
"use strict";var SourceMapConsumer=require("source-map-cjs/lib/source-map/source-map-consumer").SourceMapConsumer;var go=module.exports=function setupConsumer(sourcemap){var consumer=new SourceMapConsumer(sourcemap);var sources=sourcemap.sources;function originalPosition(line,column){return consumer.originalPositionFor({source:sourcemap.file,line:line,column:column})}return{originalPosition:originalPosition}};

},{"source-map-cjs/lib/source-map/source-map-consumer":undefined}]},{},[1])


//# sourceMappingURL=app.bundle.js.map

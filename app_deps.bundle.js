!function t(n,o,a){function s(r,e){if(!o[r]){if(!n[r]){var i="function"==typeof require&&require;if(!e&&i)return i(r,!0);if(u)return u(r,!0);throw(i=new Error("Cannot find module '"+r+"'")).code="MODULE_NOT_FOUND",i}i=o[r]={exports:{}},n[r][0].call(i.exports,function(e){return s(n[r][1][e]||e)},i,i.exports,t,n,o,a)}return o[r].exports}for(var u="function"==typeof require&&require,e=0;e<a.length;e++)s(a[e]);return s}({1:[function(e,r,i){"use strict";r.exports=function(e,r){if(e.map)return e.map(r);for(var i=[],t=0;t<e.length;t++){var n=e[t];o.call(e,t)&&i.push(r(n,t,e))}return i};var o=Object.prototype.hasOwnProperty},{}],2:[function(e,r,i){"use strict";var t="%[a-f0-9]{2}",n=new RegExp(t,"gi"),s=new RegExp("("+t+")+","gi");function u(r){try{return decodeURIComponent(r)}catch(e){for(var i=r.match(n),t=1;t<i.length;t++)i=(r=function e(r,i){try{return decodeURIComponent(r.join(""))}catch(e){}if(1===r.length)return r;var t=r.slice(0,i=i||1),i=r.slice(i);return Array.prototype.concat.call([],e(t),e(i))}(i,t).join("")).match(n);return r}}r.exports=function(r){if("string"!=typeof r)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof r+"`");try{return r=r.replace(/\+/g," "),decodeURIComponent(r)}catch(e){return function(e){for(var r={"%FE%FF":"��","%FF%FE":"��"},i=s.exec(e);i;){try{r[i[0]]=decodeURIComponent(i[0])}catch(e){var t=u(i[0]);t!==i[0]&&(r[i[0]]=t)}i=s.exec(e)}r["%C2"]="�";for(var n=Object.keys(r),o=0;o<n.length;o++){var a=n[o];e=e.replace(new RegExp(a,"g"),r[a])}return e}(r)}}},{}],3:[function(e,r,i){"use strict";r.exports=function(e,r,i){for(var t=0,n=e.length;t<n;t++)r.call(i,e[t],t,e)}},{}],4:[function(e,r,i){"use strict";r.exports=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)}},{}],5:[function(e,r,s){"use strict";function g(e,r){var i;if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator])return(i=e[Symbol.iterator]()).next.bind(i);if(Array.isArray(e)||(i=function(e,r){if(e){if("string"==typeof e)return n(e,r);var i=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(i="Object"===i&&e.constructor?e.constructor.name:i)||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?n(e,r):void 0}}(e))||r&&e&&"number"==typeof e.length){i&&(e=i);var t=0;return function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e,r){(null==r||r>e.length)&&(r=e.length);for(var i=0,t=new Array(r);i<r;i++)t[i]=e[i];return t}var i=e("strict-uri-encode"),t=e("decode-uri-component"),m=e("split-on-first");function b(e){if("string"!=typeof e||1!==e.length)throw new TypeError("arrayFormatSeparator must be single character string")}function c(e,r){return r.encode?(r.strict?i:encodeURIComponent)(e):e}function h(e,r){return r.decode?t(e):e}function u(e){var r=e.indexOf("#");return e=-1!==r?e.slice(0,r):e}function o(e){var r=(e=u(e)).indexOf("?");return-1===r?"":e.slice(r+1)}function w(e,r){return r.parseNumbers&&!Number.isNaN(Number(e))&&"string"==typeof e&&""!==e.trim()?e=Number(e):!r.parseBooleans||null===e||"true"!==e.toLowerCase()&&"false"!==e.toLowerCase()||(e="true"===e.toLowerCase()),e}function a(e,r){b((r=Object.assign({decode:!0,sort:!0,arrayFormat:"none",arrayFormatSeparator:",",parseNumbers:!1,parseBooleans:!1},r)).arrayFormatSeparator);var i=function(t){var n;switch(t.arrayFormat){case"index":return function(e,r,i){n=/\[(\d*)\]$/.exec(e),e=e.replace(/\[\d*\]$/,""),n?(void 0===i[e]&&(i[e]={}),i[e][n[1]]=r):i[e]=r};case"bracket":return function(e,r,i){n=/(\[\])$/.exec(e),e=e.replace(/\[\]$/,""),n?void 0!==i[e]?i[e]=[].concat(i[e],r):i[e]=[r]:i[e]=r};case"comma":case"separator":return function(e,r,i){r="string"==typeof r&&-1<r.split("").indexOf(t.arrayFormatSeparator)?r.split(t.arrayFormatSeparator).map(function(e){return h(e,t)}):null===r?r:h(r,t);i[e]=r};default:return function(e,r,i){void 0!==i[e]?i[e]=[].concat(i[e],r):i[e]=r}}}(r),t=Object.create(null);if("string"!=typeof e)return t;if(!(e=e.trim().replace(/^[?#&]/,"")))return t;for(var n=g(e.split("&"));!(a=n()).done;){var o=a.value,a=m(r.decode?o.replace(/\+/g," "):o,"="),o=a[0],a=void 0===(a=a[1])?null:["comma","separator"].includes(r.arrayFormat)?a:h(a,r);i(h(o,r),a,t)}for(var s=0,u=Object.keys(t);s<u.length;s++){var c=u[s],l=t[c];if("object"==typeof l&&null!==l)for(var p=0,f=Object.keys(l);p<f.length;p++){var d=f[p];l[d]=w(l[d],r)}else t[c]=w(l,r)}return!1===r.sort?t:(!0===r.sort?Object.keys(t).sort():Object.keys(t).sort(r.sort)).reduce(function(e,r){var i=t[r];return Boolean(i)&&"object"==typeof i&&!Array.isArray(i)?e[r]=function e(r){return Array.isArray(r)?r.sort():"object"==typeof r?e(Object.keys(r)).sort(function(e,r){return Number(e)-Number(r)}).map(function(e){return r[e]}):r}(i):e[r]=i,e},Object.create(null))}s.extract=o,s.parse=a,s.stringify=function(i,t){if(!i)return"";b((t=Object.assign({encode:!0,strict:!0,arrayFormat:"none",arrayFormatSeparator:","},t)).arrayFormatSeparator);for(var e,n=function(n){switch(n.arrayFormat){case"index":return function(t){return function(e,r){var i=e.length;return void 0===r||n.skipNull&&null===r||n.skipEmptyString&&""===r?e:[].concat(e,null===r?[[c(t,n),"[",i,"]"].join("")]:[[c(t,n),"[",c(i,n),"]=",c(r,n)].join("")])}};case"bracket":return function(i){return function(e,r){return void 0===r||n.skipNull&&null===r||n.skipEmptyString&&""===r?e:[].concat(e,null===r?[[c(i,n),"[]"].join("")]:[[c(i,n),"[]=",c(r,n)].join("")])}};case"comma":case"separator":return function(i){return function(e,r){return null==r||0===r.length?e:0===e.length?[[c(i,n),"=",c(r,n)].join("")]:[[e,c(r,n)].join(n.arrayFormatSeparator)]}};default:return function(i){return function(e,r){return void 0===r||n.skipNull&&null===r||n.skipEmptyString&&""===r?e:[].concat(e,null===r?[c(i,n)]:[[c(i,n),"=",c(r,n)].join("")])}}}}(t),r={},o=0,a=Object.keys(i);o<a.length;o++){var s=a[o];e=s,t.skipNull&&null==i[e]||t.skipEmptyString&&""===i[e]||(r[s]=i[s])}var u=Object.keys(r);return!1!==t.sort&&u.sort(t.sort),u.map(function(e){var r=i[e];return void 0===r?"":null===r?c(e,t):Array.isArray(r)?r.reduce(n(e),[]).join("&"):c(e,t)+"="+c(r,t)}).filter(function(e){return 0<e.length}).join("&")},s.parseUrl=function(e,r){r=Object.assign({decode:!0},r);var i=m(e,"#"),t=i[0],i=i[1];return Object.assign({url:t.split("?")[0]||"",query:a(o(e),r)},r&&r.parseFragmentIdentifier&&i?{fragmentIdentifier:h(i,r)}:{})},s.stringifyUrl=function(e,r){r=Object.assign({encode:!0,strict:!0},r);var i=u(e.url).split("?")[0]||"",t=s.extract(e.url),n=s.parse(t,{sort:!1}),o=Object.assign(n,e.query),a=(a=s.stringify(o,r))&&"?"+a,n=(t=e.url,n="",o=t.indexOf("#"),n=-1!==o?t.slice(o):n);return""+i+a+(n=e.fragmentIdentifier?"#"+c(e.fragmentIdentifier,r):n)}},{"decode-uri-component":2,"split-on-first":12,"strict-uri-encode":16}],6:[function(e,r,i){"use strict";var n=e("./util");function o(){this._array=[],this._set={}}o.fromArray=function(e,r){for(var i=new o,t=0,n=e.length;t<n;t++)i.add(e[t],r);return i},o.prototype.add=function(e,r){var i=this.has(e),t=this._array.length;i&&!r||this._array.push(e),i||(this._set[n.toSetString(e)]=t)},o.prototype.has=function(e){return Object.prototype.hasOwnProperty.call(this._set,n.toSetString(e))},o.prototype.indexOf=function(e){if(this.has(e))return this._set[n.toSetString(e)];throw new Error('"'+e+'" is not in the set.')},o.prototype.at=function(e){if(0<=e&&e<this._array.length)return this._array[e];throw new Error("No element indexed by "+e)},o.prototype.toArray=function(){return this._array.slice()},i.ArraySet=o},{"./util":11}],7:[function(e,r,i){"use strict";var u=e("./base64");i.encode=function(e){for(var r,i="",t=(e=e)<0?1+(-e<<1):e<<1;r=31&t,0<(t>>>=5)&&(r|=32),i+=u.encode(r),0<t;);return i},i.decode=function(e){var r,i,t,n=0,o=e.length,a=0,s=0;do{if(o<=n)throw new Error("Expected more digits in base 64 VLQ value.")}while(r=!!(32&(i=u.decode(e.charAt(n++)))),a+=(i&=31)<<s,s+=5,r);return{value:(t=a>>1,1==(1&a)?-t:t),rest:e.slice(n)}}},{"./base64":8}],8:[function(e,r,i){"use strict";for(var t={},n={},o=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"],a=0;a<o.length;a++){var s=o[a];t[s]=a,n[a]=s}i.encode=function(e){if(e in n)return n[e];throw new TypeError("Must be between 0 and 63: "+e)},i.decode=function(e){if(e in t)return t[e];throw new TypeError("Not a valid base 64 digit: "+e)}},{}],9:[function(e,r,i){"use strict";i.search=function(e,r,i){return 0<r.length?function e(r,i,t,n,o){var a=Math.floor((i-r)/2)+r,s=o(t,n[a],!0);return 0===s?n[a]:0<s?1<i-a?e(a,i,t,n,o):n[a]:1<a-r?e(r,a,t,n,o):r<0?null:n[r]}(-1,r.length,e,r,i):null}},{}],10:[function(e,r,i){"use strict";var f=e("./util"),o=e("./binary-search"),s=e("./array-set").ArraySet,d=e("./base64-vlq");function a(e){var r=e;"string"==typeof e&&(r=JSON.parse(e.replace(/^\)\]\}'/,"")));var i=f.getArg(r,"version"),t=f.getArg(r,"sources"),n=f.getArg(r,"names",[]),o=f.getArg(r,"sourceRoot",null),a=f.getArg(r,"sourcesContent",null),e=f.getArg(r,"mappings"),r=f.getArg(r,"file",null);if(i!=this._version)throw new Error("Unsupported version: "+i);this._names=s.fromArray(n,!0),this._sources=s.fromArray(t,!0),this.sourceRoot=o,this.sourcesContent=a,this._mappings=e,this.file=r}a.fromSourceMap=function(e){var r=Object.create(a.prototype);return r._names=s.fromArray(e._names.toArray(),!0),r._sources=s.fromArray(e._sources.toArray(),!0),r.sourceRoot=e._sourceRoot,r.sourcesContent=e._generateSourcesContent(r._sources.toArray(),r.sourceRoot),r.file=e._file,r.__generatedMappings=e._mappings.slice().sort(f.compareByGeneratedPositions),r.__originalMappings=e._mappings.slice().sort(f.compareByOriginalPositions),r},a.prototype._version=3,a.prototype.sources=function(){return this._sources.toArray().map(function(e){return this.sourceRoot?f.join(this.sourceRoot,e):e},this)},a.prototype.__generatedMappings=null,a.prototype._generatedMappings=function(){return this.__generatedMappings||(this.__generatedMappings=[],this.__originalMappings=[],this._parseMappings(this._mappings,this.sourceRoot)),this.__generatedMappings},a.prototype.__originalMappings=null,a.prototype._originalMappings=function(){return this.__originalMappings||(this.__generatedMappings=[],this.__originalMappings=[],this._parseMappings(this._mappings,this.sourceRoot)),this.__originalMappings},a.prototype._parseMappings=function(e,r){for(var i,t,n=1,o=0,a=0,s=0,u=0,c=0,l=/^[,;]/,p=e;0<p.length;)if(";"===p.charAt(0))n++,p=p.slice(1),o=0;else if(","===p.charAt(0))p=p.slice(1);else{if((i={}).generatedLine=n,t=d.decode(p),i.generatedColumn=o+t.value,o=i.generatedColumn,0<(p=t.rest).length&&!l.test(p.charAt(0))){if(t=d.decode(p),i.source=this._sources.at(u+t.value),u+=t.value,0===(p=t.rest).length||l.test(p.charAt(0)))throw new Error("Found a source, but no line and column");if(t=d.decode(p),i.originalLine=a+t.value,a=i.originalLine,i.originalLine+=1,0===(p=t.rest).length||l.test(p.charAt(0)))throw new Error("Found a source and line, but no column");t=d.decode(p),i.originalColumn=s+t.value,s=i.originalColumn,0<(p=t.rest).length&&!l.test(p.charAt(0))&&(t=d.decode(p),i.name=this._names.at(c+t.value),c+=t.value,p=t.rest)}this.__generatedMappings.push(i),"number"==typeof i.originalLine&&this.__originalMappings.push(i)}this.__generatedMappings.sort(f.compareByGeneratedPositions),this.__originalMappings.sort(f.compareByOriginalPositions)},a.prototype._findMapping=function(e,r,i,t,n){if(e[i]<=0)throw new TypeError("Line must be greater than or equal to 1, got "+e[i]);if(e[t]<0)throw new TypeError("Column must be greater than or equal to 0, got "+e[t]);return o.search(e,r,n)},a.prototype.originalPositionFor=function(e){var r={generatedLine:f.getArg(e,"line"),generatedColumn:f.getArg(e,"column")},e=this._findMapping(r,this._generatedMappings,"generatedLine","generatedColumn",f.compareByGeneratedPositions);if(e){r=f.getArg(e,"source",null);return{source:r=r&&this.sourceRoot?f.join(this.sourceRoot,r):r,line:f.getArg(e,"originalLine",null),column:f.getArg(e,"originalColumn",null),name:f.getArg(e,"name",null)}}},a.prototype.originalPositionFor=function(e){var r={generatedLine:f.getArg(e,"line"),generatedColumn:f.getArg(e,"column")},e=this._findMapping(r,this._generatedMappings(),"generatedLine","generatedColumn",f.compareByGeneratedPositions);if(e){r=f.getArg(e,"source",null);return{source:r=r&&this.sourceRoot?f.join(this.sourceRoot,r):r,line:f.getArg(e,"originalLine",null),column:f.getArg(e,"originalColumn",null),name:f.getArg(e,"name",null)}}return{source:null,line:null,column:null,name:null}},a.prototype.sourceContentFor=function(e){if(!this.sourcesContent)return null;if(this.sourceRoot&&(e=f.relative(this.sourceRoot,e)),this._sources.has(e))return this.sourcesContent[this._sources.indexOf(e)];var r;if(this.sourceRoot&&(r=f.urlParse(this.sourceRoot))){var i=e.replace(/^file:\/\//,"");if("file"==r.scheme&&this._sources.has(i))return this.sourcesContent[this._sources.indexOf(i)];if((!r.path||"/"==r.path)&&this._sources.has("/"+e))return this.sourcesContent[this._sources.indexOf("/"+e)]}throw new Error('"'+e+'" is not in the SourceMap.')},a.prototype.generatedPositionFor=function(e){e={source:f.getArg(e,"source"),originalLine:f.getArg(e,"line"),originalColumn:f.getArg(e,"column")};this.sourceRoot&&(e.source=f.relative(this.sourceRoot,e.source));e=this._findMapping(e,this._originalMappings(),"originalLine","originalColumn",f.compareByOriginalPositions);return e?{line:f.getArg(e,"generatedLine",null),column:f.getArg(e,"generatedColumn",null)}:{line:null,column:null}},a.GENERATED_ORDER=1,a.ORIGINAL_ORDER=2,a.prototype.eachMapping=function(e,r,i){var t,r=r||null;switch(i||a.GENERATED_ORDER){case a.GENERATED_ORDER:t=this._generatedMappings();break;case a.ORIGINAL_ORDER:t=this._originalMappings();break;default:throw new Error("Unknown order of iteration.")}var n=this.sourceRoot;t.map(function(e){var r=e.source;return{source:r=r&&n?f.join(n,r):r,generatedLine:e.generatedLine,generatedColumn:e.generatedColumn,originalLine:e.originalLine,originalColumn:e.originalColumn,name:e.name}}).forEach(e,r)},i.SourceMapConsumer=a},{"./array-set":6,"./base64-vlq":7,"./binary-search":9,"./util":11}],11:[function(e,r,i){"use strict";i.getArg=function(e,r,i){if(r in e)return e[r];if(3===arguments.length)return i;throw new Error('"'+r+'" is a required argument.')};var t=/([\w+\-.]+):\/\/((\w+:\w+)@)?([\w.]+)?(:(\d+))?(\S+)?/,n=/^data:.+\,.+/;function o(e){e=e.match(t);return e?{scheme:e[1],auth:e[3],host:e[4],port:e[6],path:e[7]}:null}function a(e){var r=e.scheme+"://";return e.auth&&(r+=e.auth+"@"),e.host&&(r+=e.host),e.port&&(r+=":"+e.port),e.path&&(r+=e.path),r}function s(e,r){e=e||"",r=r||"";return(r<e)-(e<r)}i.urlParse=o,i.urlGenerate=a,i.join=function(e,r){var i;return r.match(t)||r.match(n)?r:"/"===r.charAt(0)&&(i=o(e))?(i.path=r,a(i)):e.replace(/\/$/,"")+"/"+r},i.toSetString=function(e){return"$"+e},i.fromSetString=function(e){return e.substr(1)},i.relative=function(e,r){var i=o(e=e.replace(/\/$/,""));return"/"==r.charAt(0)&&i&&"/"==i.path?r.slice(1):0===r.indexOf(e+"/")?r.substr(e.length+1):r},i.compareByOriginalPositions=function(e,r,i){var t=s(e.source,r.source);return t||((t=e.originalLine-r.originalLine)||(t=e.originalColumn-r.originalColumn)||i||(t=s(e.name,r.name))||(t=e.generatedLine-r.generatedLine)?t:e.generatedColumn-r.generatedColumn)},i.compareByGeneratedPositions=function(e,r,i){var t=e.generatedLine-r.generatedLine;return t||((t=e.generatedColumn-r.generatedColumn)||i||(t=s(e.source,r.source))||(t=e.originalLine-r.originalLine)||(t=e.originalColumn-r.originalColumn)?t:s(e.name,r.name))}},{}],12:[function(e,r,i){"use strict";r.exports=function(e,r){if("string"!=typeof e||"string"!=typeof r)throw new TypeError("Expected the arguments to be of type `string`");if(""===r)return[e];var i=e.indexOf(r);return-1===i?[e]:[e.slice(0,i),e.slice(i+r.length)]}},{}],13:[function(e,r,i){"use strict";var t=e("./lib/setup-consumer"),n=e("./lib/shims");r.exports=function(e){return new o(e)};r=o.prototype;function o(e){if(!(this instanceof o))return new o(e);if("object"!=typeof e)throw new Error("sourcemap needs to be an object, please use convert-source-map module to convert it from any other format\nSee: https://github.com/thlorenz/stack-mapper#obtaining-the-source-map");this._sourcemap=e,this._prepared=!1}r._prepare=function(){var e=t(this._sourcemap);this._originalPosition=e.originalPosition,this._prepared=!0},r._mapStack=function(e){for(var r=this._sourcemap.file,i=new RegExp(r+"$"),t=0;t<e.length;t++){var n,o=e[t];i.test(o.filename)&&(n=this._originalPosition(o.line,o.column),o.filename=n.source,o.line=n.line,".js"===n.source.slice(-3)&&0===n.column&&0<o.column||(o.column=n.column))}},r.map=function(e){n.define(),this._prepared||this._prepare();e=[].concat(e);return this._mapStack(e),n.undefine(),e}},{"./lib/setup-consumer":14,"./lib/shims":15}],14:[function(e,r,i){"use strict";var n=e("source-map-cjs/lib/source-map/source-map-consumer").SourceMapConsumer,o=e("./shims");r.exports=function(i){o.define();var t=new n(i);i.sources;return o.undefine(),{originalPosition:function(e,r){return t.originalPositionFor({source:i.file,line:e,column:r})}}}},{"./shims":15,"source-map-cjs/lib/source-map/source-map-consumer":10}],15:[function(e,r,i){"use strict";var t,n,o;i.define=function(){t=Array.isArray,n=Array.map,o=Array.forEach,Array.isArray=e("isarray"),"function"!=typeof Array.map&&(Array.map=e("array-map")),"function"!=typeof Array.forEach&&(Array.forEach=e("foreach-shim"))},i.undefine=function(){Array.isArray=t,Array.map=n,Array.forEach=o}},{"array-map":1,"foreach-shim":3,isarray:4}],16:[function(e,r,i){"use strict";r.exports=function(e){return encodeURIComponent(e).replace(/[!'()*]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}},{}],17:[function(e,D,$){"use strict";!function(n,p){function e(e){for(var r={},i=0;i<e.length;i++)r[e[i].toUpperCase()]=e[i];return r}function o(e,r){return typeof e==l&&-1!==U(r).indexOf(U(e))}function a(e,r){if(typeof e==l)return e=e.replace(/^\s\s*/,"").replace(/\s\s*$/,""),typeof r==c?e:e.substring(0,255)}function s(e,r){for(var i,t,n,o,a,s=0;s<r.length&&!o;){for(var u=r[s],c=r[s+1],l=i=0;l<u.length&&!o;)if(o=u[l++].exec(e))for(t=0;t<c.length;t++)a=o[++i],typeof(n=c[t])==d&&0<n.length?2===n.length?typeof n[1]==f?this[n[0]]=n[1].call(this,a):this[n[0]]=n[1]:3===n.length?typeof n[1]!=f||n[1].exec&&n[1].test?this[n[0]]=a?a.replace(n[1],n[2]):p:this[n[0]]=a?n[1].call(this,a,n[2]):p:4===n.length&&(this[n[0]]=a?n[3].call(this,a.replace(n[1],n[2])):p):this[n]=a||p;s+=2}}function r(e,r){for(var i in r)if(typeof r[i]==d&&0<r[i].length){for(var t=0;t<r[i].length;t++)if(o(r[i][t],e))return"?"===i?p:i}else if(o(r[i],e))return"?"===i?p:i;return e}function u(e,r){if(typeof e==d&&(r=e,e=p),!(this instanceof u))return new u(e,r).getResult();var i=e||(typeof n!=c&&n.navigator&&n.navigator.userAgent?n.navigator.userAgent:""),t=r?function(e,r){var i,t={};for(i in e)r[i]&&r[i].length%2==0?t[i]=r[i].concat(e[i]):t[i]=e[i];return t}(z,r):z;return this.getBrowser=function(){var e,r={};return r[m]=p,r[w]=p,s.call(r,i,t.browser),r.major=typeof(e=r.version)==l?e.replace(/[^\d\.]/g,"").split(".")[0]:p,r},this.getCPU=function(){var e={};return e[y]=p,s.call(e,i,t.cpu),e},this.getDevice=function(){var e={};return e[h]=p,e[g]=p,e[b]=p,s.call(e,i,t.device),e},this.getEngine=function(){var e={};return e[m]=p,e[w]=p,s.call(e,i,t.engine),e},this.getOS=function(){var e={};return e[m]=p,e[w]=p,s.call(e,i,t.os),e},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return i},this.setUA=function(e){return i=typeof e==l&&255<e.length?a(e,255):e,this},this.setUA(i),this}var f="function",c="undefined",d="object",l="string",g="model",m="name",b="type",h="vendor",w="version",y="architecture",i="console",t="mobile",v="tablet",_="smarttv",x="wearable",A="embedded",k="Amazon",E="Apple",S="BlackBerry",C="Browser",j="Chrome",O="Firefox",R="Google",M="Microsoft",N="Motorola",q="Opera",L="Samsung",T="Sony",F="Zebra",P="Facebook",U=function(e){return e.toLowerCase()},I={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},z={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[w,[m,"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[w,[m,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[m,w],[/opios[\/ ]+([\w\.]+)/i],[w,[m,q+" Mini"]],[/\bopr\/([\w\.]+)/i],[w,[m,q]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,/(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,/(ba?idubrowser)[\/ ]?([\w\.]+)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i,/(weibo)__([\d\.]+)/i],[m,w],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[w,[m,"UC"+C]],[/\bqbcore\/([\w\.]+)/i],[w,[m,"WeChat(Win) Desktop"]],[/micromessenger\/([\w\.]+)/i],[w,[m,"WeChat"]],[/konqueror\/([\w\.]+)/i],[w,[m,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[w,[m,"IE"]],[/yabrowser\/([\w\.]+)/i],[w,[m,"Yandex"]],[/(avast|avg)\/([\w\.]+)/i],[[m,/(.+)/,"$1 Secure "+C],w],[/\bfocus\/([\w\.]+)/i],[w,[m,O+" Focus"]],[/\bopt\/([\w\.]+)/i],[w,[m,q+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[w,[m,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[w,[m,"Dolphin"]],[/coast\/([\w\.]+)/i],[w,[m,q+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[w,[m,"MIUI "+C]],[/fxios\/([-\w\.]+)/i],[w,[m,O]],[/\bqihu|(qi?ho?o?|360)browser/i],[[m,"360 "+C]],[/(oculus|samsung|sailfish)browser\/([\w\.]+)/i],[[m,/(.+)/,"$1 "+C],w],[/(comodo_dragon)\/([\w\.]+)/i],[[m,/_/g," "],w],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i],[m,w],[/(metasr)[\/ ]?([\w\.]+)/i,/(lbbrowser)/i],[m],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[m,P],w],[/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(chromium|instagram)[\/ ]([-\w\.]+)/i],[m,w],[/\bgsa\/([\w\.]+) .*safari\//i],[w,[m,"GSA"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[w,[m,j+" Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[m,j+" WebView"],w],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[w,[m,"Android "+C]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[m,w],[/version\/([\w\.]+) .*mobile\/\w+ (safari)/i],[w,[m,"Mobile Safari"]],[/version\/([\w\.]+) .*(mobile ?safari|safari)/i],[w,m],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[m,[w,r,{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}]],[/(webkit|khtml)\/([\w\.]+)/i],[m,w],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[m,"Netscape"],w],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[w,[m,O+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i],[m,w]],cpu:[[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],[[y,"amd64"]],[/(ia32(?=;))/i],[[y,U]],[/((?:i[346]|x)86)[;\)]/i],[[y,"ia32"]],[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],[[y,"arm64"]],[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],[[y,"armhf"]],[/windows (ce|mobile); ppc;/i],[[y,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],[[y,/ower/,"",U]],[/(sun4\w)[;\)]/i],[[y,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],[[y,U]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[g,[h,L],[b,v]],[/\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,/samsung[- ]([-\w]+)/i,/sec-(sgh\w+)/i],[g,[h,L],[b,t]],[/\((ip(?:hone|od)[\w ]*);/i],[g,[h,E],[b,t]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[g,[h,E],[b,v]],[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],[g,[h,"Huawei"],[b,v]],[/(?:huawei|honor)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i],[g,[h,"Huawei"],[b,t]],[/\b(poco[\w ]+)(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],[[g,/_/g," "],[h,"Xiaomi"],[b,t]],[/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],[[g,/_/g," "],[h,"Xiaomi"],[b,v]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[g,[h,"OPPO"],[b,t]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[g,[h,"Vivo"],[b,t]],[/\b(rmx[12]\d{3})(?: bui|;|\))/i],[g,[h,"Realme"],[b,t]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[g,[h,N],[b,t]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[g,[h,N],[b,v]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[g,[h,"LG"],[b,v]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,/\blg-?([\d\w]+) bui/i],[g,[h,"LG"],[b,t]],[/(ideatab[-\w ]+)/i,/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],[g,[h,"Lenovo"],[b,v]],[/(?:maemo|nokia).*(n900|lumia \d+)/i,/nokia[-_ ]?([-\w\.]*)/i],[[g,/_/g," "],[h,"Nokia"],[b,t]],[/(pixel c)\b/i],[g,[h,R],[b,v]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[g,[h,R],[b,t]],[/droid.+ ([c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[g,[h,T],[b,t]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[g,"Xperia Tablet"],[h,T],[b,v]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[g,[h,"OnePlus"],[b,t]],[/(alexa)webm/i,/(kf[a-z]{2}wi)( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[g,[h,k],[b,v]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[g,/(.+)/g,"Fire Phone $1"],[h,k],[b,t]],[/(playbook);[-\w\),; ]+(rim)/i],[g,h,[b,v]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[g,[h,S],[b,t]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[g,[h,"ASUS"],[b,v]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[g,[h,"ASUS"],[b,t]],[/(nexus 9)/i],[g,[h,"HTC"],[b,v]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic|sony)[-_ ]?([-\w]*)/i],[h,[g,/_/g," "],[b,t]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[g,[h,"Acer"],[b,v]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[g,[h,"Meizu"],[b,t]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[g,[h,"Sharp"],[b,t]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,/(hp) ([\w ]+\w)/i,/(asus)-?(\w+)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w]+)/i,/(jolla)/i,/(oppo) ?([\w ]+) bui/i],[h,g,[b,t]],[/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i,/(nook)[\w ]+build\/(\w+)/i,/(dell) (strea[kpr\d ]*[\dko])/i,/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,/(trinity)[- ]*(t\d{3}) bui/i,/(gigaset)[- ]+(q\w{1,9}) bui/i,/(vodafone) ([\w ]+)(?:\)| bui)/i],[h,g,[b,v]],[/(surface duo)/i],[g,[h,M],[b,v]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[g,[h,"Fairphone"],[b,t]],[/(u304aa)/i],[g,[h,"AT&T"],[b,t]],[/\bsie-(\w*)/i],[g,[h,"Siemens"],[b,t]],[/\b(rct\w+) b/i],[g,[h,"RCA"],[b,v]],[/\b(venue[\d ]{2,7}) b/i],[g,[h,"Dell"],[b,v]],[/\b(q(?:mv|ta)\w+) b/i],[g,[h,"Verizon"],[b,v]],[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],[g,[h,"Barnes & Noble"],[b,v]],[/\b(tm\d{3}\w+) b/i],[g,[h,"NuVision"],[b,v]],[/\b(k88) b/i],[g,[h,"ZTE"],[b,v]],[/\b(nx\d{3}j) b/i],[g,[h,"ZTE"],[b,t]],[/\b(gen\d{3}) b.+49h/i],[g,[h,"Swiss"],[b,t]],[/\b(zur\d{3}) b/i],[g,[h,"Swiss"],[b,v]],[/\b((zeki)?tb.*\b) b/i],[g,[h,"Zeki"],[b,v]],[/\b([yr]\d{2}) b/i,/\b(dragon[- ]+touch |dt)(\w{5}) b/i],[[h,"Dragon Touch"],g,[b,v]],[/\b(ns-?\w{0,9}) b/i],[g,[h,"Insignia"],[b,v]],[/\b((nxa|next)-?\w{0,9}) b/i],[g,[h,"NextBook"],[b,v]],[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[h,"Voice"],g,[b,t]],[/\b(lvtel\-)?(v1[12]) b/i],[[h,"LvTel"],g,[b,t]],[/\b(ph-1) /i],[g,[h,"Essential"],[b,t]],[/\b(v(100md|700na|7011|917g).*\b) b/i],[g,[h,"Envizen"],[b,v]],[/\b(trio[-\w\. ]+) b/i],[g,[h,"MachSpeed"],[b,v]],[/\btu_(1491) b/i],[g,[h,"Rotor"],[b,v]],[/(shield[\w ]+) b/i],[g,[h,"Nvidia"],[b,v]],[/(sprint) (\w+)/i],[h,g,[b,t]],[/(kin\.[onetw]{3})/i],[[g,/\./g," "],[h,M],[b,t]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[g,[h,F],[b,v]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[g,[h,F],[b,t]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[h,g,[b,i]],[/droid.+; (shield) bui/i],[g,[h,"Nvidia"],[b,i]],[/(playstation [345portablevi]+)/i],[g,[h,T],[b,i]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[g,[h,M],[b,i]],[/smart-tv.+(samsung)/i],[h,[b,_]],[/hbbtv.+maple;(\d+)/i],[[g,/^/,"SmartTV"],[h,L],[b,_]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[h,"LG"],[b,_]],[/(apple) ?tv/i],[h,[g,E+" TV"],[b,_]],[/crkey/i],[[g,j+"cast"],[h,R],[b,_]],[/droid.+aft(\w)( bui|\))/i],[g,[h,k],[b,_]],[/\(dtv[\);].+(aquos)/i],[g,[h,"Sharp"],[b,_]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i],[[h,a],[g,a],[b,_]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[b,_]],[/((pebble))app/i],[h,g,[b,x]],[/droid.+; (glass) \d/i],[g,[h,R],[b,x]],[/droid.+; (wt63?0{2,3})\)/i],[g,[h,F],[b,x]],[/(quest( 2)?)/i],[g,[h,P],[b,x]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[h,[b,A]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],[g,[b,t]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[g,[b,v]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[b,v]],[/(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i],[[b,t]],[/(android[-\w\. ]{0,9});.+buil/i],[g,[h,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[w,[m,"EdgeHTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[w,[m,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i],[m,w],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[w,m]],os:[[/microsoft (windows) (vista|xp)/i],[m,w],[/(windows) nt 6\.2; (arm)/i,/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,/(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i],[m,[w,r,I]],[/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[m,"Windows"],[w,r,I]],[/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,/cfnetwork\/.+darwin/i],[[w,/_/g,"."],[m,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[m,"Mac OS"],[w,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86)/i],[w,m],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,/(blackberry)\w*\/([\w\.]*)/i,/(tizen|kaios)[\/ ]([\w\.]+)/i,/\((series40);/i],[m,w],[/\(bb(10);/i],[w,[m,S]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],[w,[m,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[w,[m,O+" OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[w,[m,"webOS"]],[/crkey\/([\d\.]+)/i],[w,[m,j+"cast"]],[/(cros) [\w]+ ([\w\.]+\w)/i],[[m,"Chromium OS"],w],[/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux) ?([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[m,w],[/(sunos) ?([\w\.\d]*)/i],[[m,"Solaris"],w],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,/(unix) ?([\w\.]*)/i],[m,w]]};u.VERSION="1.0.2",u.BROWSER=e([m,w,"major"]),u.CPU=e([y]),u.DEVICE=e([g,h,b,i,t,_,v,x,A]),u.ENGINE=u.OS=e([m,w]),typeof $!=c?($=typeof D!=c&&D.exports?D.exports=u:$).UAParser=u:typeof define==f&&define.amd?define(function(){return u}):typeof n!=c&&(n.UAParser=u);var B,G=typeof n!=c&&(n.jQuery||n.Zepto);G&&!G.ua&&(B=new u,G.ua=B.getResult(),G.ua.get=function(){return B.getUA()},G.ua.set=function(e){B.setUA(e);var r,i=B.getResult();for(r in i)G.ua[r]=i[r]})}("object"==typeof window?window:void 0)},{}],18:[function(e,r,i){"use strict";e("./glov/require.js"),deps.assert=e("assert"),deps["query-string"]=e("query-string"),deps["stack-mapper"]=e("stack-mapper"),deps["ua-parser-js"]=e("ua-parser-js")},{"./glov/require.js":19,assert:20,"query-string":5,"stack-mapper":13,"ua-parser-js":17}],19:[function(e,r,i){"use strict";var t="undefined"==typeof window?self:window,n=t.deps=t.deps||{};t.require=function(e){if(!n[e])throw new Error("Cannot find module '"+e+"' (add it to deps.js or equivalent)");return n[e]}},{}],20:[function(e,r,i){"use strict";function t(e,r){if(!e)throw new Error("Assertion failed: "+(r||(void 0===e?"":JSON.stringify(e))))}r.exports=t,r.exports.ok=t,r.exports.equal=function(e,r){if(e!==r)throw new Error('Assertion failed: "'+e+'"==="'+r+'"')}},{}]},{},[18]);
//# sourceMappingURL=app_deps.bundle.js.map

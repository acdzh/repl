/*! For license information please see sandbox.worker.b49a93674ca6cdaf6ed1.worker.js.LICENSE.txt */
(()=>{"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}var t,n="undefined"!=typeof window&&null!==window?window:self;try{n.window=n.window||n}catch(e){}try{n.self=n.self||n}catch(e){}if(n.addEventListener("message",(function(e){for(var n=JSON.parse(e.data),o=t,r=n.type.split("."),i=0;i<r.length;i++)o=o[r[i]];"engine"===r[0]?o.bind(self.__engine)(n.data):o(n.data)}),!1),function(){var e=function(){},t=["debug","error","info","log","warn","dir","dirxml","trace","assert","count","markTimeline","profile","profileEnd","time","timeEnd","timeStamp","group","groupCollapsed","groupEnd"];"undefined"==typeof console&&(n.console={}),n.console._log=console.log;for(var o=0;o<t.length;o++)if("function"!=typeof n.console[t[o]])try{n.console[t[o]]=e}catch(e){}}(),(t={outTimeout:0,output_buffer:[],OUT_EVERY_MS:50,syncTimeout:1/0,isFrame:"undefined"!=typeof document,post:function(e){console._log(e);var t=JSON.stringify(e);this.isFrame?window.parent.postMessage(t,"*"):self.postMessage(t)},importScripts:function(e){for(var n=[],o=0,r=[],i=[],u=0,c=this,s=XMLHttpRequest||ActiveXObject("Microsoft.XMLHTTP"),a=function(t){return function(n){var s=n.loaded||n.position,a=r[t]||0;r[t]=s;var l=(u+=s-a)/o*100;i.length===e.length&&c.progress(l)}},l=e.length,f=function(e){var o;if(0===l){for(o=0;o<n.length;o++)(self.execScript||function(e){self.eval.call(self,e)})(n[o].responseText);c.engine=new self.REPLEngine(c.input,c.out,c.result,c.err,self,c.ready),self.__engine=c.engine,c.bindAll(t.engine),c.hide("REPLEngine")}},p=0;p<e.length;p++)!function(t){n[t]=new s,n[t].addEventListener&&n[t].addEventListener("progress",a(t),!1),n[t].onprogress=a(t),n[t].onreadystatechange=function(){var e;2===n[t].readyState?(e=n[t],-1===i.indexOf(e)&&(i.push(e),o+=parseInt(e.getResponseHeader("X-Raw-Length"),10))):4===n[t].readyState&&(l--,f())},n[t].open("GET",e[t],!0),n[t].send(null)}(p)},out:function(e){this.output_buffer.push(e),0===this.outTimeout?(this.outTimeout=setTimeout(this.flush,this.OUT_EVERY_MS),this.syncTimeout=Date.now()):Date.now()-this.syncTimeout>this.OUT_EVERY_MS&&(clearTimeout(this.outTimeout),this.flush())},flush:function(){if(this.output_buffer.length){var e={type:"output",data:this.output_buffer.join("")};this.post(e),this.outTimeout=0,this.output_buffer=[]}},err:function(e){var t={type:"error",data:e.toString()};this.flush(),this.post(t)},input:function(e){this.input.write=e,this.flush(),this.post({type:"input"})},result:function(e){var t={type:"result",data:e};this.flush(),this.post(t)},ready:function(e){this.post({type:"ready"})},getNextLineIndent:function(e){var t={type:"indent",data:this.engine.GetNextLineIndent(e)};this.post(t)},progress:function(e){var t={type:"progress",data:e};this.post(t)},dbInput:function(){this.flush(),this.post({type:"db_input"})},serverInput:function(){this.flush(),this.post({type:"server_input"})},bindAll:function(e){for(var t in e)!function(t){var n=e[t];"function"==typeof n&&(e[t]=function(){var t=[].slice.call(arguments);return n.apply(e,t)})}(t)},hide:function(e){try{Object.defineProperty(n,e,{writable:!1,enumerable:!1,configurable:!1,value:n[e]})}catch(e){}},set_input_server:function(e){this.input_server={url:(e.url||"/emscripten/input/")+e.input_id,cors:e.cors||!1}}}).bindAll(t),n.Sandboss=t,t.hide("Sandboss"),self.openDatabaseSync){var o=self.openDatabaseSync("replit_input","1.0","Emscripted input",1024);self.prompt=function(){t.dbInput();var e,n,r=null;for(o.transaction((function(e){r=e}));!(n=r.executeSql("SELECT * FROM input").rows).length;)for(e=0;e<1e8;e++);return r.executeSql("DELETE FROM input"),n.item(0).text},t.hide("prompt")}else t.isFrame||(self.prompt=function(){t.serverInput();var e=function(e,t,n){var o=new XMLHttpRequest;if(n)if("withCredentials"in o)o.open(e,t,!1);else{if("undefined"==typeof XDomainRequest)throw new Error("Your browser doesn' support CORS");(o=new XDomainRequest).open(e,t)}else o.open(e,t,!1);return o}("GET",t.input_server.url,t.input_server.cors);return e.send(null),200===e.status?e.responseText:"ERROR: ON NON-WEBKIT BROWSERS CONNECTION TO THE SERVER IS NEEDED FOR INPUT"});var r=function(t,n,o,r){var s=[],a=function(e,t){var n={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},o={special:"cyan",number:"blue",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"}[t];return o?"[".concat(n[o][0],"m").concat(e,"[").concat(n[o][1],"m"):e};return r||(a=function(e,t){return e}),function t(o,r){switch(e(o)){case"undefined":return a("undefined","undefined");case"string":var l="'".concat(JSON.stringify(o).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"'),"'");return a(l,"string");case"number":return a("".concat(o),"number");case"boolean":return a("".concat(o),"boolean")}if(null===o)return a("null","null");var f,p,d,g=Object.keys(o),h=n?Object.getOwnPropertyNames(o):g;if("function"==typeof o&&0===h.length){if(u(o))return a("".concat(o),"regexp");var y=o.name?": ".concat(o.name):"";return a("[Function".concat(y,"]"),"special")}if(c(o)&&0===h.length)return a(o.toUTCString(),"date");if(i(o)?(p="Array",d=["[","]"]):(p="Object",d=["{","}"]),"function"==typeof o){var m=o.name?": ".concat(o.name):"";f=u(o)?" ".concat(o):" [Function".concat(m,"]")}else f="";if(c(o)&&(f=" ".concat(o.toUTCString())),0===h.length)return d[0]+f+d[1];if(r<0)return u(o)?a("".concat(o),"regexp"):a("[Object]","special");s.push(o);var v=h.map((function(e){var n,u;if(o.__lookupGetter__&&(o.__lookupGetter__(e)?u=o.__lookupSetter__(e)?a("[Getter/Setter]","special"):a("[Getter]","special"):o.__lookupSetter__(e)&&(u=a("[Setter]","special"))),g.indexOf(e)<0&&(n="[".concat(e,"]")),u||(s.indexOf(o[e])<0?(u=null===r?t(o[e]):t(o[e],r-1)).indexOf("\n")>-1&&(u=i(o)?u.split("\n").map((function(e){return"  ".concat(e)})).join("\n").substr(2):"\n".concat(u.split("\n").map((function(e){return"   ".concat(e)})).join("\n"))):u=a("[Circular]","special")),void 0===n){if("Array"===p&&e.match(/^\d+$/))return u;(n=JSON.stringify("".concat(e))).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(n=n.substr(1,n.length-2),n=a(n,"name")):(n=n.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),n=a(n,"string"))}return"".concat(n,": ").concat(u)}));return s.pop(),v.reduce((function(e,t){return t.indexOf("\n"),e+t.length+1}),0)>80?"".concat(d[0]+(""===f?"":"".concat(f,"\n "))," ").concat(v.join(",\n  ")," ").concat(d[1]):"".concat(d[0]+f," ").concat(v.join(", ")," ").concat(d[1])}(t,void 0===o?2:o)};function i(e){return e instanceof Array||Array.isArray(e)||e&&e!==Object.prototype&&i(e.__proto__)}function u(e){var t="".concat(e);return e instanceof RegExp||"function"==typeof e&&"RegExp"===e.constructor.name&&e.compile&&e.test&&e.exec&&t.match(/^\/.*\/[gim]{0,3}$/)}function c(e){return e instanceof Date}var s=/%[sdj%]/g,a=function(t){if("string"!=typeof t){for(var n=[],o=0;o<arguments.length;o++)n.push(r(arguments[o]));return n.join(" ")}o=1;for(var i=arguments,u=i.length,c=String(t).replace(s,(function(e){if(o>=u)return e;switch(e){case"%s":return String(i[o++]);case"%d":return Number(i[o++]);case"%j":return JSON.stringify(i[o++]);case"%%":return"%";default:return e}})),a=i[o];o<u;a=i[++o])null===a||"object"!==e(a)?c+=" ".concat(a):c+=" ".concat(r(a));return c},l={};self.console.log=function(){t.out("".concat(a.apply(this,arguments)))},self.console.dir=function(e){t.out("".concat(r(e),"\n"))},self.console.time=function(e){l[e]=Date.now()},self.console.timeEnd=function(e){var t=Date.now()-l[e];self.console.log("%s = %dms",e,t)},self.console.read=function(e){e=e||function(){},t.input(e)},self.console.inspect=r})();
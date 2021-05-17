/* eslint-disable */
const global = typeof window !== 'undefined' && window !== null ? window : self;

try {
  global.window = global.window || global;
} catch (e) {
   // 
}
try {
  global.self = global.self || global;
} catch (e) {
  //
}

let Sandboss;

// Messaging.
const msg_handler = function (e) {
  const message = JSON.parse(e.data);
  let current = Sandboss;
  const parts = message.type.split('.');

  // Route message.
  for (let i = 0; i < parts.length; i++) {
    current = current[parts[i]];
  }
  if (parts[0] === 'engine') {
    // typescript class will lost it's 'this' without point to get value...
    // you can see a demo at this file's end
    // It's not a good way but i have nothing to do
    // I can not imagine that someone is still tortured by this is js at 2021!
    (current.bind(self.__engine))(message.data);
  } else {
    current(message.data);
  }
};
global.addEventListener('message', msg_handler, false);

// Dummy console for some scripts would think there is one.
(function () {
  const noop = function () {};
  const methods = ['debug', 'error', 'info', 'log',
    'warn', 'dir', 'dirxml', 'trace',
    'assert', 'count', 'markTimeline',
    'profile', 'profileEnd', 'time',
    'timeEnd', 'timeStamp', 'group',
    'groupCollapsed', 'groupEnd'];

  if (typeof console === 'undefined') {
    global.console = {};
  }

  global.console._log = console.log;

  // for (let i = 0; i < methods.length; i++) {
  //   try {
  //     global.console[methods[i]] = (...args) => {
  //       console._log(...args);
  //       Sandboss.out(args.map(a => a.toString() || '').join(',') + '\n')
  //     };
  //   } catch (e) {}
  // }

  for (let i = 0; i < methods.length; i++) {
    if (typeof global.console[methods[i]] !== 'function') {
      try {
        global.console[methods[i]] = noop;
      } catch (e) {}
    }
  }
}());

// Sandbox controller.
Sandboss = {
  outTimeout: 0,
  output_buffer: [],
  OUT_EVERY_MS: 50,
  syncTimeout: Infinity,
  isFrame: typeof document !== 'undefined',
  // Responsible for posting messages.
  post(msg) {
    console._log(msg);
    const msgStr = JSON.stringify(msg);
    if (this.isFrame) {
      // Window communication require additional origin argument.
      window.parent.postMessage(msgStr, '*');
    } else {
      self.postMessage(msgStr);
    }
  },
  // Import an array of scripts.
  importScripts(scriptsArr) {
    const reqs = [];
    let totalSize = 0;
    const lastLoadedTable = [];
    const totalUpdated = [];
    let totalLoaded = 0;
    const that = this;
    const XHR = XMLHttpRequest || ActiveXObject('Microsoft.XMLHTTP');

    const updateSize = function (req) {
      if (totalUpdated.indexOf(req) === -1) {
        totalUpdated.push(req);
        totalSize += parseInt(req.getResponseHeader('X-Raw-Length'), 10);
      }
    };

    const updateProgressCreator = function (index) {
      return function (e) {
        const loaded = e.loaded || e.position;
        const lastLoaded = lastLoadedTable[index] || 0;

        lastLoadedTable[index] = loaded;
        totalLoaded += loaded - lastLoaded;
        const percentageDone = (totalLoaded / totalSize) * 100;
        if (totalUpdated.length === scriptsArr.length) {
          that.progress(percentageDone);
        }
      };
    };

    let finished = scriptsArr.length;
    const finish = function (e) {
      let i;
      if (finished === 0) {
        for (i = 0; i < reqs.length; i++) {
          (self.execScript || function (data) {
            self.eval.call(self, data);
          })(reqs[i].responseText);
        }
        that.engine = new self.REPLEngine(that.input, that.out, that.result, that.err, self, that.ready);
        self.__engine = that.engine;
        that.bindAll(Sandboss.engine);
        that.hide('REPLEngine');
      }
    };
    for (let i = 0; i < scriptsArr.length; i++) {
      (function (i) {
        reqs[i] = new XHR();
        if (reqs[i].addEventListener) {
          reqs[i].addEventListener('progress', updateProgressCreator(i), false);
        }
        reqs[i].onprogress = updateProgressCreator(i);
        reqs[i].onreadystatechange = function () {
          if (reqs[i].readyState === 2) {
            updateSize(reqs[i]);
          } else if (reqs[i].readyState === 4) {
            finished--;
            finish();
          }
        };
        reqs[i].open('GET', scriptsArr[i], true);
        reqs[i].send(null);
      }(i));
    }
  },
  // Outbound output.
  out(text) {
    const that = this;
    this.output_buffer.push(text);
    if (this.outTimeout === 0) {
      this.outTimeout = setTimeout(this.flush, this.OUT_EVERY_MS);
      this.syncTimeout = Date.now();
    } else if (Date.now() - this.syncTimeout > this.OUT_EVERY_MS) {
      clearTimeout(this.outTimeout);
      this.flush();
    }
  },

  flush() {
    if (!this.output_buffer.length) return;
    const message = {
      type: 'output',
      data: this.output_buffer.join(''),
    };
    this.post(message);
    this.outTimeout = 0;
    this.output_buffer = [];
  },
  // Outbound errors.
  err(e) {
    const message = {
      type: 'error',
      data: e.toString(),
    };
    this.flush();
    this.post(message);
  },
  // Outbound input.
  input(callback) {
    // Incoming input would call "Sandboss.input.write", hence its our continuation callback.
    this.input.write = callback;
    const message = {
      type: 'input',
    };
    this.flush();
    this.post(message);
  },
  result(data) {
    const message = {
      type: 'result',
      data,
    };
    this.flush();
    this.post(message);
  },
  // Outbound language ready function.
  ready(data) {
    const message = {
      type: 'ready',
    };
    this.post(message);
  },
  // Inbound/Outbound getNextLineIndent.
  // Gets the nextline indent and sends it in an 'indent' message.
  getNextLineIndent(data) {
    // Get line indent
    const indent = this.engine.GetNextLineIndent(data);
    const message = {
      type: 'indent',
      data: indent,
    };
    this.post(message);
  },
  progress(data) {
    const message = {
      type: 'progress',
      data,
    };
    this.post(message);
  },
  dbInput() {
    const message = {
      type: 'db_input',
    };
    this.flush();
    this.post(message);
  },
  serverInput() {
    const message = {
      type: 'server_input',
    };
    this.flush();
    this.post(message);
  },
  // Bind all methods to its owner object.
  bindAll(obj) {
    for (const method in obj) {
      (function (method) {
        const fn = obj[method];
        if (typeof fn === 'function') {
          obj[method] = function () {
            const args = [].slice.call(arguments);
            return fn.apply(obj, args);
          };
        }
      }(method));
    }
  },
  // Try to hide and secure stuff.
  hide(prop) {
    try {
      Object.defineProperty(global, prop, {
        writable: false,
        enumerable: false,
        configurable: false,
        value: global[prop],
      });
    } catch (e) {}
  },

  set_input_server(settings) {
    this.input_server = {
      url: (settings.url || '/emscripten/input/') + settings.input_id,
      cors: settings.cors || false,
    };
  },
};

// Bind all the sand minions to the SANDBOSS!! MWAHAHAHA
Sandboss.bindAll(Sandboss);
global.Sandboss = Sandboss;
Sandboss.hide('Sandboss');

const createRequest = function (method, url, isCors) {
  let xhr = new XMLHttpRequest();
  if (isCors) {
    if ('withCredentials' in xhr) {
      xhr.open(method, url, false);
    } else if (typeof XDomainRequest !== 'undefined') {
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      throw new Error('Your browser doesn\' support CORS');
    }
  } else {
    xhr.open(method, url, false);
  }
  return xhr;
};

// Synchronous input for emscripted languages.
if (self.openDatabaseSync) {
  const DB = self.openDatabaseSync('replit_input', '1.0', 'Emscripted input', 1024);
  self.prompt = function () {
    Sandboss.dbInput();
    let t = null;
    DB.transaction((tx) => { t = tx; });
    let i; let j; let
      res;
    while (!(res = t.executeSql('SELECT * FROM input').rows).length) {
      for (i = 0; i < 100000000; i++);
    }
    t.executeSql('DELETE FROM input');
    return res.item(0).text;
  };
  Sandboss.hide('prompt');
} else if (!Sandboss.isFrame) {
  self.prompt = function () {
    Sandboss.serverInput();
    const req = createRequest('GET', Sandboss.input_server.url, Sandboss.input_server.cors);
    req.send(null);

    if (req.status === 200) {
      return req.responseText;
    }
    return 'ERROR: ON NON-WEBKIT BROWSERS CONNECTION TO THE SERVER IS NEEDED FOR INPUT';
  };
}

/**
  @preserve
  Copyright Joyent, Inc. and other Node contributors.

  Permission is hereby granted, free of charge, to any person obtaining a
  copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to permit
  persons to whom the Software is furnished to do so, subject to the
  following conditions:

  The above copyright notice and this permission notice shall be included
  in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  USE OR OTHER DEALINGS IN THE SOFTWARE.

  Original at: https://github.com/joyent/node/blob/master/lib/util.js
*/

// The maximum length of a line in the stylized output.
const MAX_COLUMNS = 80;
/**
 * Echos the value of a value. Tries to print the value out in the best way
 * possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Boolean} showHidden Flag that shows hidden (not enumerable)
 *    properties of objects.
 * @param {Number} depth Depth in which to descend in object. Default is 2.
 * @param {Boolean} colors Flag to turn on ANSI escape codes to color the
 *    output. Default is false (no coloring).
 */
const inspect = function (obj, showHidden, depth, colors) {
  const seen = [];

  let stylize = function (str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    const styles = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39],
    };

    const style = {
      special: 'cyan',
      number: 'blue',
      boolean: 'yellow',
      undefined: 'grey',
      null: 'bold',
      string: 'green',
      date: 'magenta',
      // "name": intentionally not styling
      regexp: 'red',
    }[styleType];

    if (style) {
      return `\u001b[${styles[style][0]}m${str
      }\u001b[${styles[style][1]}m`;
    }
    return str;
  };
  if (!colors) {
    stylize = function (str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = `'${JSON.stringify(value).replace(/^"|"$/g, '')
          .replace(/'/g, "\\'")
          .replace(/\\"/g, '"')}'`;
        return stylize(simple, 'string');

      case 'number':
        return stylize(`${value}`, 'number');

      case 'boolean':
        return stylize(`${value}`, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    const visible_keys = Object.keys(value);
    const keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize(`${value}`, 'regexp');
      }
      const name = value.name ? `: ${value.name}` : '';
      return stylize(`[Function${name}]`, 'special');
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    let base; let type; let
      braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      const n = value.name ? `: ${value.name}` : '';
      base = (isRegExp(value)) ? ` ${value}` : ` [Function${n}]`;
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ` ${value.toUTCString()}`;
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize(`${value}`, 'regexp');
      }
      return stylize('[Object]', 'special');
    }

    seen.push(value);

    let output = keys.map((key) => {
      let name; let
        str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else if (value.__lookupSetter__(key)) {
          str = stylize('[Setter]', 'special');
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = `[${key}]`;
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map((line) => `  ${line}`).join('\n').substr(2);
            } else {
              str = `\n${str.split('\n').map((line) => `   ${line}`).join('\n')}`;
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify(`${key}`);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
            .replace(/\\"/g, '"')
            .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return `${name}: ${str}`;
    });

    seen.pop();

    let numLinesEst = 0;
    const length = output.reduce((prev, cur) => {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > MAX_COLUMNS) {
      output = `${braces[0]
                + (base === '' ? '' : `${base}\n `)
      } ${
        output.join(',\n  ')
      } ${
        braces[1]}`;
    } else {
      output = `${braces[0] + base} ${output.join(', ')} ${braces[1]}`;
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};

function isArray(ar) {
  return ar instanceof Array
          || Array.isArray(ar)
          || (ar && ar !== Object.prototype && isArray(ar.__proto__));
}

function isRegExp(re) {
  const s = `${re}`;
  return re instanceof RegExp // easy case
          // duck-type for context-switching evalcx case
          || typeof (re) === 'function'
          && re.constructor.name === 'RegExp'
          && re.compile
          && re.test
          && re.exec
          && s.match(/^\/.*\/[gim]{0,3}$/);
}

function isDate(d) {
  return d instanceof Date;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  const d = new Date();
  const time = [pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

const formatRegExp = /%[sdj%]/g;
const format = function (f) {
  if (typeof f !== 'string') {
    const objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  const args = arguments;
  const len = args.length;
  let str = String(f).replace(formatRegExp, (x) => {
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      case '%%': return '%';
      default:
        return x;
    }
  });
  for (let x = args[i]; i < len; x = args[++i]) {
    if (x === null || typeof x !== 'object') {
      str += ` ${x}`;
    } else {
      str += ` ${inspect(x)}`;
    }
  }
  return str;
};

const times = {};
self.console.log = function () {
  Sandboss.out(`${format.apply(this, arguments)}\n`);
},
self.console.dir = function (obj) {
  Sandboss.out(`${inspect(obj)}\n`);
},
self.console.time = function (label) {
  times[label] = Date.now();
},
self.console.timeEnd = function (label) {
  const duration = Date.now() - times[label];
  self.console.log('%s = %dms', label, duration);
},
self.console.read = function (cb) {
  cb = cb || function () {};
  Sandboss.input(cb);
},
self.console.inspect = inspect;

/*
class A {
  public whoiam() {
    console.log(this);
  }
}

class B {
  a: A;

  constructor() {
    this.a = new A();
  }

  public gg() {
    let c: any = this;
    c = c.a;
    c = c.whoiam;
    c();
    c.bind(this.a)();
    this.a.whoiam();
  }
}

(new B()).gg();
*/

/* eslint-disable  */
var global = typeof window !== "undefined" && window !== null ? window : self;

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
  if(parts[0] === 'engine') {
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

  for (let i = 0; i < methods.length; i++) {
    try {
      global.console[methods[i]] = (...args) => {
        console._log(...args);
        Sandboss.out(args.map(a => a.toString() || '').join(',') + '\n')
      };
    } catch (e) {}
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
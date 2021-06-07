import EventEmitter, { AnyFunctionType } from './EventEmitter';
import Sandbox from './Sandbox';

import languageDic from './languages';

/* eslint-disable no-param-reassign */
type REPLConstructorPropsType = {
  input?: AnyFunctionType;
  output?: AnyFunctionType;
  result?: AnyFunctionType;
  ready?: AnyFunctionType;
  error?: AnyFunctionType;
  progress: AnyFunctionType;
  timeout?: {
    time: number;
    callback: AnyFunctionType;
  };
  inputServer?: {
    inputId?: number;
    url?: string;
  };
}

export default class REPL extends EventEmitter {
  private lang: any;

  private sandbox: Sandbox;

  private currentLangName: string;

  private timeout: {
    time: number;
    callback: AnyFunctionType;
  };

  constructor({
    result,
    error,
    input,
    output,
    progress,
    ready,
    timeout,
    inputServer = {},
  }: REPLConstructorPropsType) {
    console.time('REPL Ready');
    super();
    const db = window.openDatabase('replit_input', '1.0', 'Emscripted input', 1024);
    db.transaction((tx) => {
      tx.executeSql('DROP TABLE IF EXISTS input');
      tx.executeSql('CREATE TABLE input (text)');
    });
    inputServer.inputId = Math.floor(Math.random() * 9007199254740992) + 1;

    // The definition of the current language.
    this.lang = null;
    this.currentLangName = '';

    this.timeout = timeout;

    // There are two input event types. Abstract that for users.
    this.on('input', input);

    // Create initial worker.
    const baseScripts: string[] = [];

    this.sandbox = new Sandbox(baseScripts, inputServer, {
      output,
      input: () => {
        this.fire('input', (data: unknown) => {
          this.sandbox.post({
            type: 'input.write',
            data,
          });
        });
      },
      error,
      result,
      ready,
      progress,
      db_input: () => {
        this.fire('input', (data: unknown) => {
          this.sandbox.fire('recieved_input', [data]);
          db.transaction((tx) => {
            tx.executeSql(`INSERT INTO input (text) VALUES ('${data}')`, []);
          });
        });
      },
      server_input: () => {
        this.fire('input', (data: unknown) => {
          this.sandbox.fire('recieved_input', [data]);
          // TODO server_input sync
          // not support yet
          // бесполезный~
        });
      },
    });
  }

  // ThereOnly listen to input events to abstract all input types.
  // ThereProxy other events to the sandbox.
  public on(types: string | string[], fn: AnyFunctionType): void {
    EventEmitter.makeArray<string>(types).forEach((type) => {
      if (type === 'input') {
        super.on('input', fn);
      } else {
        this.sandbox.on(type, fn);
      }
    });
  }

  public off(types: string | string[], fn: AnyFunctionType): void {
    EventEmitter.makeArray<string>(types).forEach((type) => {
      if (type === 'input') {
        super.off('input', fn);
      } else {
        this.sandbox.off(type, fn);
      }
    });
  }

  public loadLanguage(langName: string, loadInWorker = true, callback: AnyFunctionType): void {
    if (!languageDic[langName]) {
      throw new Error(`Language ${langName} not supported.`);
    }
    this.currentLangName = langName;
    this.lang = languageDic[langName];

    this.sandbox.once('ready', () => {
      console.timeEnd('REPL Ready');
    });

    if (callback) {
      this.sandbox.once('ready', callback);
    }

    this.sandbox.load([...this.lang.scripts, this.lang.engine], loadInWorker);
  }

  // eslint-disable-next-line no-unused-vars
  public checkLineEnd(command: string, callback: (arg0: boolean) => void):void {
    if (/\n\s*$/.test(command)) {
      callback(false);
    } else {
      this.sandbox.once('indent', callback);
      this.sandbox.post({
        type: 'getNextLineIndent',
        data: command,
      });
    }
  }

  public eval(command: string, callback?: AnyFunctionType): void {
    if (
      !this.sandbox.workerIsIframe
      && this.timeout
      && this.timeout.callback
      && this.timeout.callback
    ) {
      let t: number;
      const cb = () => {
        this.sandbox.fire('timeout', []);
        const a = this.timeout.callback();
        if (!a) {
          t = window.setTimeout(cb, this.timeout.time);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          unbind();
        }
      };

      t = window.setTimeout(cb, this.timeout.time);
      const listener = (...args: any[]) => {
        const type: string = args[args.length - 1];
        window.clearTimeout(t);
        if (type === 'input') {
          this.once('recieved_input', () => {
            t = window.setTimeout(cb, this.timeout.time);
          });
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          bind();
        }
      };

      const bind = () => {
        this.once(['result', 'error', 'input'], listener);
      };

      const unbind = () => {
        this.off(['result', 'error', 'input'], listener);
      };

      bind();
    }
    this.once(['result', 'error'], (...args: any[]) => {
      const type: string = args[args.length - 1];
      if (callback) {
        if (type === 'error') {
          callback(args[0], null);
        } else {
          callback(null, args[0]);
        }
      }
    });

    this.sandbox.post({
      type: 'engine.Eval',
      data: command,
    });
  }

  public evalSync(command: string): Promise<any> {
    return new Promise((resolve) => {
      this.eval(command, (...args) => {
        resolve(args[1]);
      });
    });
  }

  public rawEval(command: string): void {
    this.sandbox.post({
      type: 'engine.RawEval',
      data: command,
    });
  }

  public getLangConfig(langName: string): any {
    return languageDic[langName || this.currentLangName] || null;
  }
}

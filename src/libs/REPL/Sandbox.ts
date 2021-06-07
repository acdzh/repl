import EventEmitter, { AnyFunctionType, EventEmitterListenerType } from './EventEmitter';
import Loader from './Loader';
import { scriptMap, workerSupported } from './const';

// eslint-disable-next-line import/extensions
import SandboxWorker from './sandbox.worker.js';

export default class Sandbox extends EventEmitter {
  // The scripts that loads every time a new worker is created.
  private baseScripts: string[];

  private inputServer: any;

  private loader: Loader;

  // maybe a worker instance or a iframe window
  private worker: Worker | Window | null;

  public workerIsIframe: boolean;

  constructor(
    baseScripts: string[],
    inputServer: any,
    listeners = {} as {
      [property: string]: AnyFunctionType | AnyFunctionType[];
    },
  ) {
    super();
    this.baseScripts = baseScripts
      .map((script) => scriptMap[script].src || '')
      .filter((i) => i !== '');
    this.inputServer = inputServer;
    this.loader = new Loader();
    Object.keys(listeners).forEach((type) => {
      // eslint-disable-next-line no-param-reassign
      listeners[type] = EventEmitter.makeArray<AnyFunctionType>(listeners[type]);
    });
    this.listeners = listeners as EventEmitterListenerType;
    this.worker = null;
    this.workerIsIframe = false;
  }

  // onmessage handler for worker.
  private onmsg(event: MessageEvent): void {
    // IE fires extra events that we want to ignore.
    try {
      const msg = JSON.parse(event.data);
      // Execute listeners.
      this.fire(msg.type, [msg.data]);
    } catch (e) {
      // do nothing to ignore
    }
  }

  // Loads a new instance of a worker with the basescripts + the new scripts.
  public load(moreScripts: string[], workerFriendly = true): void {
    const allScripts = this.baseScripts.concat(
      moreScripts.map((script) => scriptMap[script]?.src || script)
        .filter((i) => i !== ''),
    );
    if (this.worker) {
      this.kill();
    }
    const postCreate = () => {
      this.post({
        type: 'importScripts',
        data: allScripts,
      });
      if (this.inputServer) {
        this.post({
          type: 'set_input_server',
          data: this.inputServer,
        });
      }
    };

    // Remove previous onmsg handler on the window if exists.
    window.removeEventListener('message', this.onmsg.bind(this), false);

    if (!workerSupported || !workerFriendly) {
      // Worker not supported;
      // or do not want ro use worker
      // create a new iframe sandbox replacing the old one.
      this.loader.createSandbox((sandbox) => {
        this.worker = sandbox as Window;
        this.workerIsIframe = true;
        window.addEventListener('message', this.onmsg.bind(this), false);
        postCreate();
      });
    } else {
      // Workers are supported! \o/
      this.worker = new SandboxWorker();
      this.workerIsIframe = false;
      this.worker?.addEventListener('message', this.onmsg.bind(this) as any, false);
      postCreate();
    }
  }

  public post(msgObj: {type: string; data: unknown }): void {
    const msgStr = JSON.stringify(msgObj);
    if (this.workerIsIframe) {
      // Worker is an iframe;
      // additional origin argument required.
      (this.worker as Window)?.postMessage(msgStr, '*');
    } else {
      (this.worker as Worker)?.postMessage(msgStr);
    }
  }

  // Terminate worker or delete iframe.
  private kill() {
    if (!this.workerIsIframe) {
      (this.worker as Worker).terminate();
    }
    if (this.loader.body && this.loader.iframe) {
      this.loader.body.removeChild(this.loader.iframe);
      this.loader.iframe = null;
    }
  }
}

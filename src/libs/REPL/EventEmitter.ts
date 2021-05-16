/* eslint-disable @typescript-eslint/no-explicit-any */

// this class is different from @libs/Event
// eslint-disable-next-line no-unused-vars
export type AnyFunctionType = (...args: any[]) => any;

export type EventEmitterListenerType = {
  [property: string]: AnyFunctionType[];
};

export default class EventEmitter {
  protected listeners: EventEmitterListenerType;

  constructor() {
    this.listeners = {};
  }

  static makeArray<T>(obj: T | T[]): T[] {
    return Array.isArray(obj)
      ? obj as unknown as T[]
      : [obj] as unknown as T[];
  }

  public on(types: string | string[], fn: AnyFunctionType): void {
    EventEmitter.makeArray<string>(types).forEach((type) => {
      if (this.listeners[type]) {
        this.listeners[type].push(fn);
      } else {
        this.listeners[type] = [fn];
      }
    });
  }

  public off(types: string | string[], fn: AnyFunctionType): void {
    EventEmitter.makeArray<string>(types).forEach((type) => {
      const listeners = this.listeners[type];
      if (!listeners) {
        return;
      }
      if (fn) {
        const i = listeners.indexOf(fn);
        if (i > -1) {
          listeners.splice(i, 1);
        } else {
          this.listeners[type] = [];
        }
      }
    });
  }

  public fire(type: string, _args: any | any[]): any[] {
    const args = EventEmitter.makeArray(_args);
    const listeners = this.listeners[type];
    if (!listeners) {
      return [];
    }
    args.push(type);
    return listeners.map((fn) => fn.apply(this, args));
  }

  public once(_types: string | string[], fn: AnyFunctionType): void {
    const types = EventEmitter.makeArray<string>(_types);
    const cb = (...args: any[]) => {
      types.forEach((type) => {
        this.off(type, cb);
      });
      fn(...args);
    };
    types.forEach((type) => {
      this.on(type, cb);
    });
  }
}

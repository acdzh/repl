/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import LuaVM from 'lua.vm.js';

import { AnyFunctionType } from '../utils';

export default class REPLEngine {
  // input: AnyFunctionType;

  // output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: any; // Worker | Window

  inspect: AnyFunctionType;

  // ready: AnyFunctionType;

  lua: any;

  constructor(
    input: AnyFunctionType,
    output: AnyFunctionType,
    result: AnyFunctionType,
    error: AnyFunctionType,
    sandbox: any, // Worker | Window
    ready: AnyFunctionType,
  ) {
    // this.input = input;
    // this.output = output;
    this.result = result;
    this.error = error;
    this.sandbox = sandbox;
    // this.ready = ready;

    this.inspect = this.sandbox.console.inspect;

    this.lua = new LuaVM.Lua.State();

    ready();
  }

  Eval(command: string): void {
    try {
      const result = this.lua.execute(command);
      if (result === undefined || result === null) {
        return;
      } if (Array.isArray(result) && result.length === 0) {
        return;
      }
      this.result(result === undefined ? '' : this.inspect(result));
    } catch (e) {
      this.error(e);
    }
  }

  RawEval(command: string): void {
    try {
      const result = this.lua.execute(command);
      if (result === undefined || result === null) {
        return;
      } if (Array.isArray(result) && result.length === 0) {
        return;
      }
      this.result(result);
    } catch (e) {
      this.error(e);
    }
  }

  // GetNextLineIndent(command: string): boolean | number {

  // }
}

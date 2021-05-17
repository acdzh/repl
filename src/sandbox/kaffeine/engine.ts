/* eslint-disable camelcase */
/* eslint-disable no-new */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */

import { AnyFunctionType } from '../utils';

export default class REPLEngine {
  // input: AnyFunctionType;

  // output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: any; // Worker | Window

  inspect: AnyFunctionType;

  Function: FunctionConstructor;

  tokenizer: any;

  kaffeine: any;

  // ready: AnyFunctionType;

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
    this.Function = this.sandbox.Function;

    this.sandbox.__eval = this.sandbox.eval;

    this.tokenizer = this.sandbox.require('kaffeine/token');
    const Kaffeine = this.sandbox.require('kaffeine');

    this.kaffeine = new Kaffeine();

    ready();
  }

  Compile(command: string): string {
    let js = this.kaffeine.compile(command);
    // Kaffeine sometimes produces expressions and sometimes statements. We
    // need to try both.
    try {
      new this.Function(js);
    } catch (e) {
      js = `(${js})`;
    }
    return js;
  }

  Eval(command: string): void {
    let js;
    try {
      js = this.Compile(command);
    } catch (e) {
      e.message = `Compiling: ${e.message}`;
      this.error(e);
      return;
    }
    try {
      const result = this.sandbox.__eval(js);
      this.result(result === undefined ? '' : this.inspect(result));
    } catch (e) {
      this.error(e);
    }
  }

  EvalSync(command: string): string {
    return this.sandbox.__eval(this.Compile(command));
  }

  GetNextLineIndent(command: string): boolean | number {
    try {
      let token = this.tokenizer.ize(command);
      while (token != null) {
        if (token.bang) {
          return 0;
        }
        token = token.next;
      }
    } catch (error) {
      return 1;
    }
    try {
      let js = this.kaffeine.compile(command);
      try {
        new this.Function(js);
      } catch (error) {
        js = `(${js})`;
        new this.Function(js);
      }
      const last_line = command.split('\n').slice(-1)[0];
      if (/^\s+/.test(last_line)) {
        return 0;
      }
      return false;
    } catch (error) {
      if (/^\s*(for|while|if|else)\b|[[{(]$/.test(command)) {
        return 1;
      }
      return 0;
    }
  }
}

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

  compile: AnyFunctionType;

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

    // Cache sandboxed objects and functions used by the engine in case sandbox
    // bindings hide them.
    this.inspect = this.sandbox.console.inspect;
    this.Function = this.sandbox.Function;
    this.sandbox.__eval = this.sandbox.eval;
    this.compile = this.sandbox.move.compile;

    this.sandbox.move.runtime.print = (...args: any[]) => {
      output(`${args.join(' ')}\n`);
    };
    this.sandbox.move.runtime.read = input;

    Object.entries(this.sandbox.move.runtime).forEach(([name, func]) => {
      this.sandbox[name] = func;
    });

    ready();
  }

  Eval(command: string): void {
    try {
      const js = this.compile(command, {
        wrapSource: false,
        includeRuntime: false,
      });
      const result = this.sandbox.__eval(js);
      this.result(result === undefined ? '' : this.inspect(result));
    } catch (e) {
      this.error(e);
    }
  }

  EvalSync(command: string): string {
    const js = this.compile(command, {
      wrapSource: false,
      includeRuntime: false,
    });
    return this.sandbox.__eval(js);
  }

  // GetNextLineIndent(command: string): boolean | number {

  // }
}

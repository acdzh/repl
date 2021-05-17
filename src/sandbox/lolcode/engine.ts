/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
/* eslint-disable no-new */
/* eslint-disable no-underscore-dangle */
import parser from 'lolcode/parser';

import { AnyFunctionType } from '../utils';

self.parser = parser;

export default class REPLEngine {
  // input: AnyFunctionType;

  output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: any; // Worker | Window

  inspect: AnyFunctionType;

  Function: FunctionConstructor;

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
    this.output = output;
    this.result = result;
    this.error = error;
    this.sandbox = sandbox;
    // this.ready = ready;

    this.inspect = this.sandbox.console.inspect;
    this.Function = this.sandbox.Function;

    this.sandbox.__eval = this.sandbox.eval;

    ready();
  }

  Eval(command: string): void {
    try {
      parser(command, (error: string, warn: string, js: string) => {
        if (error) {
          throw new Error(`Compiling: ${command}\n ${error}`);
        }
        if (warn) {
          this.output(`warning: ${warn}`);
        }
        const result = this.sandbox.__eval(js);
        this.result(result === undefined || result === null ? '' : this.inspect(result));
      });
    } catch (e) {
      this.error(e);
    }
  }

  // GetNextLineIndent(command: string): boolean | number {

  // }
}

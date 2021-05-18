/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import { AnyFunctionType } from '../utils';

export default class REPLEngine {
  // input: AnyFunctionType;

  // output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: Worker | Window;

  ready: AnyFunctionType;

  inspect: AnyFunctionType;

  Brython: any;

  constructor(
    input: AnyFunctionType,
    output: AnyFunctionType,
    result: AnyFunctionType,
    error: AnyFunctionType,
    sandbox: Worker | Window,
    ready: AnyFunctionType,
  ) {
    this.result = result;
    this.error = error;
    this.sandbox = sandbox;
    this.ready = ready;

    this.inspect = this.sandbox.console.inspect;

    this.Brython = this.sandbox.__BRYTHON__;
    this.sandbox.__eval = this.sandbox.eval;
    this.ready();
  }

  Eval(command: string): void {
    try {
      const compiled = this.Brython.python_to_js(command);
      const result = this.sandbox.__eval(compiled);
      // this.result(result === undefined ? '' : this.inspect(result));
    } catch (e) {
      this.error(e);
    }
  }

  RawEval(command: string): void {
    try {
      const compiled = this.Brython.python_to_js(command);
      const result = this.sandbox.__eval(compiled);
      // this.result(result);
    } catch (e) {
      this.error(e);
    }
  }

  GetNextLineIndent(command: string): boolean | number {
    const lines = command.split('\n');
    if (lines.length === 0) {
      return 0;
    }
    let last_line = lines[lines.length - 1];
    const indent = (last_line.match(/^\s*/) || [])[0];
    last_line = lines[lines.length - 1].replace(/\s+$/, '');
    if (last_line[last_line.length - 1] === ':') {
      return 1;
    } if (indent.length && last_line[last_line.length - 1].length !== 0) {
      return 0;
    }
    return false;
  }
}

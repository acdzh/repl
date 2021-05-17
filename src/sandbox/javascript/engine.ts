/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import { AnyFunctionType } from '../utils';

export default class REPLEngine {
  // input: AnyFunctionType;

  // output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: any; // Worker | Window

  // ready: AnyFunctionType;

  inspect: AnyFunctionType;

  Function: FunctionConstructor;

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

    ready();
  }

  Eval(command: string): void {
    try {
      const result = this.sandbox.__eval(command);
      this.result(result === undefined ? '' : this.inspect(result));
    } catch (e) {
      this.error(e);
    }
  }

  RawEval(command: string): void {
    try {
      const result = this.sandbox.__eval(command);
      this.result(result);
    } catch (e) {
      this.error(e);
    }
  }

  GetNextLineIndent(command: string): number | boolean {
    try {
      // eslint-disable-next-line no-new
      new this.Function(command);
      return false;
    } catch (e) {
      if (/[\[\{\(]$/.test(command)) {
        return 1;
      }
      return 0;
    }
  }
}

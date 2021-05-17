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
    ready();
  }

  Eval(command: string): void {
    try {

    } catch (e) {
      this.error(e);
    }
  }

  RawEval(command: string): void {
    try {

    } catch (e) {
      this.error(e);
    }
  }

  EvalSync(command: string): string {
    try {

    } catch (e) {
      this.error(e);
    }
  }

  GetNextLineIndent(command: string): boolean | number {

  }
}

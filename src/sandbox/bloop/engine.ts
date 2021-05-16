/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import { AnyFunctionType } from '../utils';

export default class REPLEngine {
  input: AnyFunctionType;

  output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: Worker | Window;

  ready: AnyFunctionType;

  constructor(
    input: AnyFunctionType,
    output: AnyFunctionType,
    result: AnyFunctionType,
    error: AnyFunctionType,
    sandbox: Worker | Window,
    ready: AnyFunctionType,
  ) {
    this.input = input;
    this.output = output;
    this.result = result;
    this.error = error;
    this.sandbox = sandbox;
    this.ready = ready;

    this.sandbox.BFloop.init(this.output);

    this.ready();
  }

  Eval(command: string): void {
    try {
      const code = this.sandbox.BFloop.compile(command);
      this.result(this.sandbox.eval(code));
    } catch (e) {
      this.error(e);
    }
  }

  EvalSync(command: string): string {
    const code = this.sandbox.BFloop.compile(command);
    return this.sandbox.eval(code);
  }

  GetNextLineIndent(command: string): boolean {
    const rOpen = /BLOCK\s+(\d+)\s*:\s*BEGIN/ig;
    const rClose = /BLOCK\s+(\d+)\s*:\s*END/ig;
    const match = function (code: string) {
      const opens = code.match(rOpen) || [];
      const closes = code.match(rClose) || [];
      return opens.length - closes.length;
    };
    if (match(command) <= 0) {
      return false;
    }
    return match(command.split('\n').slice(-1)[0]) > 0;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AnyFunctionType } from '../utils';

export default class REPLEngine {
  input: AnyFunctionType;

  output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: Worker | Window;

  ready: AnyFunctionType;

  ws: any;

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

    const f = () => {
      throw Error('I/O is not supported');
    };

    this.ws = (this.sandbox as any).apl.ws({
      in: f,
      out: f,
    });

    this.ready();
  }

  Eval(command: string): void {
    try {
      const r = (this.ws(command) || '').toString();
      this.result(
        // eslint-disable-next-line no-nested-ternary
        !r
          ? ''
          : r.indexOf('\n') !== -1
            ? `\n${r}`
            : r,
      );
    } catch (e) {
      this.error(e);
    }
  }

  GetNextLineIndent(command: string): boolean {
    return false;
  }
}

/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import { AnyFunctionType, encodeUtf8, makeUtf8Print } from '../utils';

export default class REPLEngine {
  // input: AnyFunctionType;

  output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  Python: any;

  error_buffer: any[];

  // sandbox: any; // Worker | Window

  // ready: AnyFunctionType;

  constructor(
    _input: AnyFunctionType,
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
    // this.sandbox = sandbox;
    // this.ready = ready;

    this.Python = sandbox.Python;

    sandbox.print = () => {
      //
    };
    this.error_buffer = [];
    const printOutput = makeUtf8Print(output);
    const bufferError = (chr: string): void => {
      if (chr) {
        if (this.Python.isHandlingError) {
          this.error_buffer.push(String.fromCharCode(chr));
        }
      } else {
        printOutput(chr);
      }
    };
    this.Python.initialize(null, printOutput, bufferError);
    ready();
  }

  Eval(command: string): void {
    this.error_buffer = [];
    try {
      const result = this.Python.eval(encodeUtf8(command));
      if (result === undefined) {
        this.error(this.error_buffer.join('') || 'Unknown error.');
      } else {
        this.output(this.error_buffer.join(''));
        this.result(result);
      }
    } catch (e) {
      this.error(e);
    }
  }

  RawEval(command: string): void {
    this.Eval(command);
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

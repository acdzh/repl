/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import { AnyFunctionType } from '../utils';

// How many stack items to print when showing the result of a command.
const RESULT_SIZE = 5;

export default class REPLEngine {
  input: AnyFunctionType;

  output: AnyFunctionType;

  result: AnyFunctionType;

  // error: AnyFunctionType;

  sandbox: any;

  ready: AnyFunctionType;

  printed: boolean; // Have we printed at least one character this run?

  finished: boolean; // Have we already called the result or error callback?

  inputting: boolean; // Are we currently reading data?

  lines: number; // How many lines does the current command contain?

  constructor(
    input: AnyFunctionType,
    output: AnyFunctionType,
    result: AnyFunctionType,
    error: AnyFunctionType,
    sandbox: any, // Worker | Window,
    ready: AnyFunctionType,
  ) {
    // this.input = input;
    // this.output = output;
    // this.result = result;
    // this.error = error;
    this.sandbox = sandbox;
    // this.ready = ready;

    this.printed = false;

    this.finished = false;

    this.inputting = false;

    this.lines = 0;

    this.sandbox._init();

    this.sandbox._error = (e) => {
      this.finished = true;
      error(e);
    };

    this.sandbox._print = (str) => {
      this.printed = true;
      output(str);
    };

    this.sandbox._prompt = () => {
      // eslint-disable-next-line no-plusplus
      if (--this.lines === 0 && !this.inputting && !this.finished) {
        return this.sandbox._finish();
      }
    };

    this.sandbox._input = (): AnyFunctionType | void => {
      if (this.finished) {
        return;
      }
      this.inputting = true;
      // eslint-disable-next-line consistent-return
      return input((result: string[]) => {
        result.forEach((chr: string) => {
          this.sandbox.inbuf.push(chr.charCodeAt(0));
        });
        this.sandbox.inbuf.push(13);
        this.inputting = false;
        return callback();
      });
    };

    this.sandbox._finish = () => {
      if (this.finished) {
        return;
      }
      this.sandbox.inbuf = [];
      const top = this.sandbox._stacktop(RESULT_SIZE + 1);
      if (top.length) {
        if (top.length > RESULT_SIZE) {
          top[0] = '...';
        }
        result(top.join(' '));
      } else {
        if (this.printed) {
          output('\n');
        }
        result('');
      }
      this.finished = true;
    };

    ready();
  }

  Eval(command: string): void {
    this.printed = false;
    this.finished = false;
    this.inputting = false;
    this.lines = command.split('\n').length;
    try {
      this.sandbox._run(command);
    } catch (e) {
      this.sandbox._error(e);
    }
  }

  // EvalSync(command: string): string {

  // }

  GetNextLineIndent(command: string): number {
    const countParens = (str: string) => {
      let depth = 0;
      str.split(/\s+/).forEach((token) => {
        switch (token) {
          case ':':
            depth += 1;
            break;
          case ';':
            depth -= 1;
            break;
          default: // do nothing
        }
      });
      return depth;
    };

    if (countParens(command) <= 0) {
      return 0;
    }
    const parens_in_last_line = countParens(command.split('\n').slice(-1)[0]);
    if (parens_in_last_line > 0) {
      return 1;
    } if (parens_in_last_line < 0) {
      return parens_in_last_line;
    }
    return 0;
  }
}
function callback() {
  throw new Error('Function not implemented.');
}

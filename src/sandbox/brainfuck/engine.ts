/* eslint-disable class-methods-use-this */
import { Interpreter } from './bf';

/* eslint-disable camelcase */
export default class REPLEngine {
  result: any;

  error: any;

  sandbox: any;

  result_fn_factory: any;

  result_handler: any;

  BFI: Interpreter;

  constructor(input, output, result, error, sandbox, ready) {
    this.result = result;
    this.error = error;
    this.sandbox = sandbox;

    this.result_fn_factory = (result_fn) => (data, index) => {
      const epi = '...';
      //  Copy the data array
      const cells = data.map((x) => x);
      // When we are at a newly visited unmodified cell
      // the data array length is wrong.
      cells.length = cells.length < index ? index + 1 : cells.length;
      cells.forEach((v, i) => { if (!v) { cells[i] = 0; } });

      let lower;
      if (index < 10) {
        lower = 0;
      } else {
        lower = index - 10;
        cells[lower] = epi + cells[lower];
      }

      if (!cells[index]) cells[index] = 0;
      const before = cells.slice(lower, index);
      if (cells[index + 10]) {
        cells[index + 10] += epi;
      }
      const after = cells.slice(index + 1, index + 10);
      return result_fn(before.concat([`[${cells[index]}]`]).concat(after).join(' '));
    };
    this.result_handler = this.result_fn_factory(this.result);
    this.BFI = new Interpreter(input, output, this.result_handler);
    ready();
  }

  public Eval(command: string): void {
    try {
      if (command === 'SHOWTAPE') {
        this.BFI.result = (data, index) => {
          const cells = data.map((x) => x);
          cells.length = cells.length < index ? index + 1 : cells.length;
          cells.forEach((v, i) => { if (!v) { cells[i] = 0; } });

          cells[index] = `[${!cells[index] ? cells[index] : 0}]`;
          return this.result(cells.join(' '));
        };

        this.BFI.evaluate('');
        this.BFI.result = this.result_handler;
        return;
      } if (command.match(/^RESET\b/)) {
        this.BFI.reset();
        this.BFI.evaluate(command.replace(/^RESET/, ''));
        return;
      }
      this.BFI.evaluate(command);
    } catch (e) {
      this.error(e);
    }
  }

  EvalSync(command) {
    // TODO
    let ret = null;
    this.BFI.result = this.result_fn_factory((res) => { ret = res; });
    this.BFI.evaluate(command);
    this.BFI.result = this.result_handler;
    return ret;
  }

  GetNextLineIndent(command) {
    const countParens = (str: string) => {
      const tokens = str.split('');
      let parens = 0;
      tokens.forEach((token) => {
        if (token === '[') parens += 1;
        else if (token === ']') parens -= 1;
      });
      return parens;
    };
    if (countParens(command) <= 0) {
      return false;
    }
    const parents_in_last_line = countParens(command.split('\n').reverse()[0]);
    if (parents_in_last_line > 0) {
      return 1;
    } if (parents_in_last_line < 0) {
      return parents_in_last_line;
    }
    return 0;
  }
}

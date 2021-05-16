/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import { AnyFunctionType } from '../utils';
import {
  Parser,
  Interpreter,
} from './libs/Emoticon';

export default class REPLEngine {
  input: AnyFunctionType;

  output: AnyFunctionType;

  // result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: Worker | Window;

  // ready: AnyFunctionType;

  result_fn_factory: AnyFunctionType;

  result_handler: AnyFunctionType;

  interpreter: any;

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
    this.error = error;
    this.sandbox = sandbox;

    this.result_fn_factory = (result_fn) => (env: any) => {
      const result_env = Object.entries(env).map(([listName, list]) => {
        let listStr = (list as any).toString();
        let len = listStr.length - 74;
        len = len > 0 ? len : 0;
        listStr = listStr.slice(len);
        if (len > 0) {
          listStr = `...${listStr}`;
        }
        return `${listName}: ${listStr}`;
      }).join('\n');
      result_fn(result_env);
    };
    this.result_handler = this.result_fn_factory(result);

    this.interpreter = new Interpreter({
      source: [],
      input: this.input,
      print: this.output,
      result: this.result_handler,
    });

    ready();
  }

  Eval(command: string): void {
    try {
      if (command.match(/^RESET\b/)) {
        this.interpreter = new Interpreter({
          source: [],
          input: this.input,
          print: this.output,
          result: this.result_handler,
        });
        // eslint-disable-next-line no-param-reassign
        command = command.replace(/^RESET/, '');
      }
      const code = Parser(command);
      this.interpreter.lists.Z = this.interpreter.lists.Z.concat(code);
      this.interpreter.run();
    } catch (e) {
      this.error(e);
    }
  }

  EvalSync(command: string): string {
    const code = Parser(command);
    this.interpreter.lists.Z = this.interpreter.lists.Z.concat(code);
    let ret = '';
    this.interpreter.result = this.result_fn_factory((res: any) => {
      ret = res;
      return ret;
    });
    this.interpreter.run();
    this.interpreter.result = this.result_handler;
    return ret;
  }

  GetNextLineIndent(command: string): number {
    const countParens = (str: string): number => {
      const tokens = Parser(str);
      let parens = 0;
      tokens.forEach((token) => {
        if (token.mouth) {
          if (token.mouth === '(') {
            parens += 1;
          } else if (token.mouth === ')') {
            parens -= 1;
          }
        }
      });
      return parens;
    };

    if (countParens(command) <= 0) {
      return 0;
    }
    const parens_in_last_line = countParens(command.split('\n').slice(-1)[0]);
    // eslint-disable-next-line no-nested-ternary
    return parens_in_last_line > 0 ? 1 : parens_in_last_line < 0 ? parens_in_last_line : 0;
  }
}

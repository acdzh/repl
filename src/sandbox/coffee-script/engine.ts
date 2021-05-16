/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import { AnyFunctionType } from '../utils';

const SCOPE_OPENERS = [
  'FOR', 'WHILE', 'UNTIL', 'LOOP', 'IF', 'POST_IF', 'SWITCH', 'WHEN', 'CLASS',
  'TRY', 'CATCH', 'FINALLY',
];

export default class REPLEngine {
  // input: AnyFunctionType;

  // output: AnyFunctionType;

  result: AnyFunctionType;

  error: AnyFunctionType;

  sandbox: Worker | Window;

  ready: AnyFunctionType;

  CoffeeScript: any;

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

    this.CoffeeScript = this.sandbox.CoffeeScript;
    this.sandbox.__eval = this.sandbox.eval;
    this.ready();
  }

  Eval(command: string): void {
    try {
      const compiled = this.CoffeeScript.compile(command, {
        globals: true,
        bare: true,
      });
      const result = this.sandbox.__eval(compiled);
      this.result(result);
    } catch (e) {
      this.error(e);
    }
  }

  GetNextLineIndent(command: string): boolean {
    const last_line = command.split('\n').slice(-1)[0];
    let all_tokens: string[];
    let last_line_tokens;
    if (/([-=]>|[\[\{\(]|\belse)$/.test(last_line)) {
      // An opening brace, bracket, paren, function arrow or "else".
      return true;
    }
    try {
      all_tokens = this.CoffeeScript.tokens(command);
      last_line_tokens = this.CoffeeScript.tokens(last_line);
    } catch (e) {
      return false;
    }
    try {
      this.CoffeeScript.compile(command);
      if (/^\s+/.test(last_line)) {
        return false;
      }
      if (all_tokens.some((token, index) => {
        const next = all_tokens[index + 1];
        return (token[0] === 'REGEX' && token[1] === '/(?:)/' && next[0] === 'MATH' && next[1] === '/');
      })) {
        return false;
      }
      return true; // ?
    } catch (e) {
      let scopes = 0;
      last_line_tokens.forEach((token, index) => {
        scopes += (
          // eslint-disable-next-line no-nested-ternary
          SCOPE_OPENERS.indexOf(token[0])
            ? 1
            : token.fromThen
              ? -1
              : 0
        );
      });
      return scopes > 0;
    }
  }
}

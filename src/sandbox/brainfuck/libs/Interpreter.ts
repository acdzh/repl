/* eslint-disable func-names */
/* eslint-disable camelcase */

import Parser from './Parser';
import Token from './Token';
import { ErrOutOfRange, MAX_DATA_COUNT } from './utils';

// eslint-disable-next-line no-underscore-dangle
const _noop = () => {
  // nothing
};

export default class Interpreter {
  user_input: any;

  user_output: any;

  result: any;

  d_ptr: number;

  i_ptr: number;

  data: number[];

  code: Token[];

  instruction: Token;

  constructor(input, output, result) {
    this.user_input = input;
    this.user_output = output;
    this.result = typeof result === 'function' ? result : _noop;
    this.reset();
  }

  reset() {
    this.d_ptr = 0;
    this.i_ptr = 0;
    // instead of allocating 30000 bytes, we consider undefined to be 0
    this.data = [];
  }

  evaluate(code: string | Parser) {
    this.code = (code instanceof Parser ? code : new Parser(code)).tokenized;
    this.i_ptr = 0;
    this.run();
  }

  run() {
    let cont: () => void;
    while (typeof cont !== 'function') {
      this.instruction = this.code[this.i_ptr];
      if (!this.instruction) {
        cont = this.result;
      } else {
        cont = this[this.instruction.type]();
        // console.log(this.instruction, this, this.data.join(', '));
        this.i_ptr += 1;
      }
    }
    cont(this.data, this.d_ptr);
  }

  increment_pointer() {
    if (this.d_ptr === MAX_DATA_COUNT - 1) throw ErrOutOfRange;
    this.d_ptr += 1;
  }

  decrement_pointer() {
    if (this.d_ptr === 0) throw ErrOutOfRange;
    this.d_ptr -= 1;
  }

  zerofy() {
    if (this.data[this.d_ptr] === undefined) this.data[this.d_ptr] = 0;
  }

  increment_data() {
    this.zerofy();
    this.data[this.d_ptr] += 1;
  }

  decrement_data() {
    this.zerofy();
    this.data[this.d_ptr] -= 1;
  }

  output() {
    this.user_output(String.fromCharCode(this.data[this.d_ptr]));
  }

  input() {
    return (function () {
      this.user_input((_data) => {
        const data = _data.toString();
        this.data[this.d_ptr] = data.charCodeAt(0) || 10;
        this.run();
      });
    }).bind(this);
  }

  jump_forward_if_zero() {
    if (!this.data[this.d_ptr]) {
      this.i_ptr = this.instruction.match;
    }
  }

  jump_backward_if_nonzero() {
    if (this.data[this.d_ptr]) {
      this.i_ptr = this.instruction.match;
    }
  }
}

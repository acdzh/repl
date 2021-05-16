import Token from './Token';

/** ********************** Parser ************************ */
// Class: Parser @arg (String) program code
//          this.tokenized:  Array of tokens

export default class Parser {
  tokenized: Token[];

  constructor(code: string) {
    const tokenized = [];
    const matchStack = [];

    const tokens = {
      '>': 'increment_pointer',
      '<': 'decrement_pointer',
      '+': 'increment_data',
      '-': 'decrement_data',
      '.': 'output',
      ',': 'input',
      '[': 'jump_forward_if_zero',
      ']': 'jump_backward_if_nonzero',
    };

    let i = 0;
    // DO NOT USE INDEX OF FOREACH!!!!!!
    code.split('').forEach((ch) => {
      if (tokens[ch]) {
        const token = new Token(tokens[ch], ch, i);
        if (ch === '[') {
          matchStack.push(token);
        } else if (ch === ']') {
          const prev = matchStack.pop();
          if (!prev) throw new Error('Mismatched Brackets.');
          prev.match = token.number;
          token.match = prev.number;
        }
        tokenized.push(token);
        i += 1;
      }
      // ignore everything else.
    });

    this.tokenized = tokenized;
  }
}

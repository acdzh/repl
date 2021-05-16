/* eslint-disable prefer-destructuring */
import Instruction from './Instruction';

// Parses the original code into an array of instructions.

/* eslint-disable no-cond-assign */
export default function Parser(code: string): Instruction[] {
  // eslint-disable-next-line no-useless-escape
  const rEmoticon = /^([^\s]+[OC<>\[\]VD@PQ7L#${}\\\/()|3E*])(\s|$)/;
  const rNumber = /^-?\d+/;
  const rSpace = /^[ \t\v]+/;
  const rNewLine = /^(\n)/;
  const rComment = /^\*\*([^*]|\*[^*])*\*\*/;
  const rWord = /^([^\s]+)\s*/;
  const source = [];

  let match;
  let token: Instruction;
  while (code) {
    if (match = code.match(rSpace)) {
      match = match[0];
    } else if (match = code.match(rNewLine)) {
      match = match[0];
    } else if (match = code.match(rComment)) {
      match = match[0];
    } else if (match = code.match(rEmoticon)) {
      match = match[1];
      token = new Instruction(match, 'emoticon');
      source.push(token);
    } else if (match = code.match(rNumber)) {
      match = match[0];
      token = new Instruction(parseInt(match, 10).toString(), 'data');
      source.push(token);
    } else if (match = code.match(rWord)) {
      match = match[1];
      token = new Instruction(match, 'data');
      source.push(token);
    }
    // eslint-disable-next-line no-param-reassign
    code = code.slice(match?.length || 0);
  }
  return source;
}

import apl from './apl';
import bloop from './bloop';
import brainfuck from './brainfuck';
import coffeescript from './coffeescript';
import emoticon from './emoticon';
import forth from './forth';
import javascript from './javascript';
import kaffeine from './kaffeine';
import lolcode from './lolcode';
import lua from './lua';
import move from './move';
import python from './python';
import qbasic from './qbasic';
import roy from './roy';
import ruby from './ruby';
import scheme from './scheme';
import traceur from './traceur';
import unlambda from './unlambda';

type ExampleType = {
  name: string;
  content: string;
};

export default {
  apl,
  bloop,
  brainfuck,
  coffeescript,
  emoticon,
  forth,
  javascript,
  kaffeine,
  lolcode,
  lua,
  move,
  python,
  qbasic,
  roy,
  ruby,
  scheme,
  traceur,
  unlambda,
} as {
  [propType: string]: {
    console: ExampleType[];
    editor: ExampleType[];
  };
};

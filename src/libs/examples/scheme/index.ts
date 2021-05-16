import helloworld from './console/helloworld.txt';
import input from './console/input.txt';
import fibonacci from './console/fibonacci.txt';
import ycombinator from './editor/ycombinator.txt';
import macro from './editor/macro.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Input',
      content: input as string,
    },
    {
      name: 'Fibonacci',
      content: fibonacci as string,
    },
  ],
  editor: [
    {
      name: 'Y Combinator',
      content: ycombinator as string,
    },
    {
      name: 'Macro',
      content: macro as string,
    },
  ],
};

import helloworld from './console/helloworld.txt';
import loop from './console/loop.txt';
import input from './console/input.txt';
import conditionals from './editor/conditionals.txt';
import subroutine from './editor/subroutine.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Loop',
      content: loop as string,
    },
    {
      name: 'Input',
      content: input as string,
    },
  ],
  editor: [
    {
      name: 'Conditionals',
      content: conditionals as string,
    },
    {
      name: 'Subroutine',
      content: subroutine as string,
    },
  ],
};

import helloworld from './console/helloworld.txt';
import input from './console/input.txt';
import loop from './console/loop.txt';
import scopes from './editor/scopes.txt';
import factorial from './editor/factorial.txt';

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
      name: 'Loop',
      content: loop as string,
    },
  ],
  editor: [
    {
      name: 'Scopes',
      content: scopes as string,
    },
    {
      name: 'Factorial',
      content: factorial as string,
    },
  ],
};

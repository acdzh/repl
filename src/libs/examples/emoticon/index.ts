import helloworld from './console/helloworld.txt';
import conditional from './console/conditional.txt';
import loop from './editor/loop.txt';
import reverse from './editor/reverse.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Conditional',
      content: conditional as string,
    },
  ],
  editor: [
    {
      name: 'Loop',
      content: loop as string,
    },
    {
      name: 'Reverse',
      content: reverse as string,
    },
  ],
};

import helloworld from './console/helloworld.txt';
import iteration from './console/iteration.txt';
import input from './console/input.txt';
import conditionals from './editor/conditionals.txt';
import fibonacci from './editor/fibonacci.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Iteration',
      content: iteration as string,
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
      name: 'Fibonacci',
      content: fibonacci as string,
    },
  ],
};

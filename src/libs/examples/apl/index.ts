import helloworld from './console/helloworld.txt';
import fibonacci from './console/fibonacci.txt';
import conwaysgameoflife from './editor/conwaysgameoflife.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Fibonacci',
      content: fibonacci as string,
    },
  ],
  editor: [
    {
      name: 'Conway\'s Game of Life',
      content: conwaysgameoflife as string,
    },
  ],
};

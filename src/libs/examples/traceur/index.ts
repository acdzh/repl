import helloworld from './console/helloworld.txt';
import loop from './console/loop.txt';
import spread from './console/spread.txt';
import generator from './editor/generator.txt';

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
      name: 'Spread',
      content: spread as string,
    },
  ],
  editor: [
    {
      name: 'Generator',
      content: generator as string,
    },
  ],
};

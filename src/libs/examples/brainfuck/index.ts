import helloworld from './console/helloworld.txt';
import fibonacci from './editor/fibonacci.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
  ],
  editor: [
    {
      name: 'Fibonacci',
      content: fibonacci as string,
    },
  ],
};

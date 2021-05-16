import helloworld from './console/helloworld.txt';
import power from './console/power.txt';
import fibonacci from './editor/fibonacci.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Power',
      content: power as string,
    },
  ],
  editor: [
    {
      name: 'Fibonacci',
      content: fibonacci as string,
    },
  ],
};

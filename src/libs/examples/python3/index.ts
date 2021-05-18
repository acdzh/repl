import helloworld from './console/helloworld.txt';
import loop from './console/loop.txt';
import class_ from './editor/class.txt';
import factorial from './editor/factorial.txt';

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
  ],
  editor: [
    {
      name: 'Class',
      content: class_ as string,
    },
    {
      name: 'Factorial',
      content: factorial as string,
    },
  ],
};

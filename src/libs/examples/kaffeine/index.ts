import helloworld from './console/helloworld.txt';
import input from './console/input.txt';
import function_ from './console/function_.txt';
import class_ from './editor/class_.txt';
import conditional from './editor/conditional.txt';

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
      name: 'Function',
      content: function_ as string,
    },
  ],
  editor: [
    {
      name: 'Class',
      content: class_ as string,
    },
    {
      name: 'Conditional',
      content: conditional as string,
    },
  ],
};

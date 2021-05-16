import helloworld from './console/helloworld.txt';
import object from './console/object.txt';
import input from './console/input.txt';
import class_ from './editor/class_.txt';
import fibonacci from './editor/fibonacci.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Object',
      content: object as string,
    },
    {
      name: 'Input',
      content: input as string,
    },
  ],
  editor: [
    {
      name: 'Class',
      content: class_ as string,
    },
    {
      name: 'Fibonacci',
      content: fibonacci as string,
    },
  ],
};

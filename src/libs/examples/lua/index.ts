import helloworld from './console/helloworld.txt';
import loop from './console/loop.txt';
import table from './console/table.txt';
import firstclassfunction from './editor/firstclassfunction.txt';
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
    {
      name: 'Table',
      content: table as string,
    },
  ],
  editor: [
    {
      name: 'First-class Function',
      content: firstclassfunction as string,
    },
    {
      name: 'Factorial',
      content: factorial as string,
    },
  ],
};

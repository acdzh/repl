import helloworld from './console/helloworld.txt';
import calculator from './console/calculator.txt';
import loop from './console/loop.txt';
import echo from './editor/echo.txt';
import nestedloop from './editor/nestedloop.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Calculator',
      content: calculator as string,
    },
    {
      name: 'Loop',
      content: loop as string,
    },
  ],
  editor: [
    {
      name: 'Echo',
      content: echo as string,
    },
    {
      name: 'Nested Loop',
      content: nestedloop as string,
    },
  ],
};

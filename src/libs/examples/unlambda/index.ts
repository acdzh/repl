import helloworld from './console/helloworld.txt';
import echo from './console/echo.txt';
import loop from './console/loop.txt';
import squares from './editor/squares.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Echo',
      content: echo as string,
    },
    {
      name: 'Loop',
      content: loop as string,
    },
  ],
  editor: [
    {
      name: 'Squares',
      content: squares as string,
    },
  ],
};

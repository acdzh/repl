import helloworld from './console/helloworld.txt';
import input from './console/input.txt';
import with_ from './console/with_.txt';
import gcd from './editor/gcd.txt';
import tracingmonad from './editor/tracingmonad.txt';

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
      name: 'With',
      content: with_ as string,
    },
  ],
  editor: [
    {
      name: 'GCD',
      content: gcd as string,
    },
    {
      name: 'Tracing monad',
      content: tracingmonad as string,
    },
  ],
};

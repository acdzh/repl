import helloworld from './console/helloworld.txt';
import comprehension from './console/comprehension.txt';
import factorial from './console/factorial.txt';
import classes from './editor/classes.txt';

export default {
  console: [
    {
      name: 'Hello World',
      content: helloworld as string,
    },
    {
      name: 'Comprehension',
      content: comprehension as string,
    },
    {
      name: 'Factorial',
      content: factorial as string,
    },
  ],
  editor: [
    {
      name: 'Classes',
      content: classes as string,
    },
  ],
};

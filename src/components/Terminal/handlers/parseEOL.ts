import { ReactNode } from 'react';
import innerText from '@utils/innerText';

type MessageType = {
  message: ReactNode;
  isEcho: boolean;
};

export default (stdout: MessageType[]): MessageType[] => {
  const parsedStdout: MessageType[] = [];

  for (let i = 0; i < stdout.length; i += 1) {
    const currentLine = stdout[i];
    const { message, isEcho } = currentLine;

    const messageText = innerText(message);

    // Do not parse echoes (Raw inputs)
    const parsed = !isEcho && /\n|\\n/g.test(messageText) ? messageText.split(/\n|\\n/g) : [message];

    parsed.forEach((line) => {
      parsedStdout.push({ message: line, isEcho: currentLine.isEcho });
    });
  }

  return parsedStdout;
};

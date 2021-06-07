import React from 'react';

type TerminalEchoPropsType = {
  promptLabel: React.ReactNode;
  rawInput: React.ReactNode;
}

const TerminalEcho: React.FC<TerminalEchoPropsType> = ({
  promptLabel,
  rawInput,
}) => (
  <pre className="terminal-messagee-container">
    <span>
      {promptLabel}
      {promptLabel ? ' ' : ''}
    </span>
    <span>{rawInput}</span>
  </pre>
);

export default TerminalEcho;

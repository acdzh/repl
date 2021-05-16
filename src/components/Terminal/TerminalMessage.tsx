import React from 'react';

type TerminalMessagePropsStyle = {
  content?: React.ReactNode | string;
  style?: React.CSSProperties;
  className?: string;
  isDangerMode?: boolean;
}

const TerminalMessage: React.FC<TerminalMessagePropsStyle> = ({
  content = '',
  style = {},
  className = '',
  isDangerMode = false,
}) => (
  <div
    className={className}
    style={{ ...style, lineHeight: '21px' }}
      // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={isDangerMode ? { __html: content as string } : undefined}
  >
    {
        !isDangerMode && content
      }
  </div>
);
export default TerminalMessage;

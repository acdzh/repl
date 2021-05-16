import React, { useCallback } from 'react';
import hljs from './hljs';

import './index.scss';

type HighlightPropsType = {
  children?: React.ReactNode;
  className?: string;
  language?: string;
  theme?: 'dark' | 'light',
};

const Highlight: React.FC<HighlightPropsType> = ({
  children,
  className = '',
  language,
  theme = 'light',
}) => {
  const highlight = useCallback((): string => {
    if (!language) {
      return hljs.highlightAuto(children?.toString() || '').value;
    }
    try {
      return hljs.highlight(children?.toString() || '', { language }).value;
    } catch {
      return hljs.highlightAuto(children?.toString() || '').value;
    }
  }, [children, language]);
  return (
    <pre className={`${className} ${language} hljs-${theme}`}>
      <code
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: highlight(),
        }}
      />
    </pre>
  );
};

export default Highlight;

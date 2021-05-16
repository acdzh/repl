import React from 'react';

const loadingStyles = {
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

type LoadingPropsType = {
  content?: React.ReactNode;
}

const Loading = ({ content }) => (
  <div style={loadingStyles}>{content}</div>
);

export default Loading;

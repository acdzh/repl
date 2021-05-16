import React, { memo } from 'react';
import Loading from '../Loading';

type ContainerPropsType = {
  width: number | string;
  height: number | string;
  loading: React.ReactNode | string;
  isEditorReady: boolean;
  className?: string;
  wrapperClassName?: string;
}

const Container:React.FC<ContainerPropsType> = React.forwardRef(
  ({
    width,
    height,
    isEditorReady,
    loading,
    className,
    wrapperClassName,
  }, ref) => (
    <section
      style={{
        display: 'flex',
        position: 'relative',
        textAlign: 'initial',
        width,
        height,
      }}
      className={wrapperClassName}
    >
      {!isEditorReady && <Loading content={loading} />}
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        style={{
          width: '100%',
          display: isEditorReady ? 'none' : 'unset',
        }}
        className={className}
      />
    </section>
  ),
);

export default memo(Container);

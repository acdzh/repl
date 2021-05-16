import React, { useCallback, useState } from 'react';

const useRenderController = (): {
  flag: React.ReactNode;
  reRender: () => void;
} => {
  const [a, setA] = useState<number>(0);
  const reRender = useCallback(() => {
    setTimeout(() => {
      setA((_a) => (_a > 100000 ? 0 : a + 1));
    }, 10);
  }, [a, setA]);
  return {
    flag: <span style={{ display: 'none' }}>{a}</span>,
    reRender,
  };
};

export default useRenderController;

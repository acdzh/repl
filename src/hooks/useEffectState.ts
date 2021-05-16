import {
  useState, useEffect, Dispatch, DependencyList, SetStateAction,
} from 'react';

const useEffectState = <S>(fn: () => S, deps?: DependencyList)
: [S, Dispatch<SetStateAction<S>>] => {
  const [v, setV] = useState<S>(fn());
  useEffect(() => {
    setV(fn());
  }, deps);
  return [v, setV];
};

export default useEffectState;

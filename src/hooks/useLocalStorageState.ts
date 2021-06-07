import { useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';

const useLocalStorageState = <T>(
  key: string,
  initialValue: T,
  forceUpdate = false,
  interval = 2000,
): [storedValue: T, setValue: (value: T | ((v: T) => T)) => void] => {
  const [vFromLS, setVFromLS] = useLocalStorage(
    key,
    initialValue,
    forceUpdate,
  );
  const [v, setV] = useState(vFromLS);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(new Date().getTime());

  useEffect(() => {
    const nowTime = new Date().getTime();
    if (nowTime - interval > lastUpdateTime) {
      setVFromLS(v);
      setLastUpdateTime(nowTime);
    }
  }, [v, setVFromLS, lastUpdateTime, setLastUpdateTime]);

  return [v, setV];
};

export default useLocalStorageState;

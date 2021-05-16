import { useEffect, DependencyList } from 'react';
import Event, { ListenerType } from '@libs/Event';

const useLinster = (
  e: Event | undefined | null,
  listener: ListenerType,
  deps: DependencyList,
): void => {
  if (e) {
    useEffect(() => {
      e.register(listener);
      return () => {
        e.unRegister(listener);
      };
    }, [e, ...deps]);
  }
};

export default useLinster;

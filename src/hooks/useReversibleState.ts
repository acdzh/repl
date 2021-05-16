import {
  Dispatch, SetStateAction,
} from 'react';
import useEditableState from './useEditableState';

const useReversibleState = (initialState: boolean | (() => boolean))
: [
  boolean,
  Dispatch<SetStateAction<boolean>>,
  () => void
] => {
  const [v, setV, reverseV] = useEditableState<boolean>(initialState, (a) => !a);
  return [v, setV, reverseV];
};

export default useReversibleState;

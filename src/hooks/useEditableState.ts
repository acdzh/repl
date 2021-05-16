import {
  useState, Dispatch, SetStateAction, useCallback,
} from 'react';

const useEditableState = <S>(
  initialState: S | (() => S),
  // eslint-disable-next-line no-unused-vars
  editState: (arg: S) => S,
)
: [
  S,
  Dispatch<SetStateAction<S>>,
  () => void
] => {
  const [v, setV] = useState<S>(initialState);
  const reverseV = useCallback(() => {
    setV((v_) => editState(v_));
  }, [v]);
  return [v, setV, reverseV];
};

export default useEditableState;

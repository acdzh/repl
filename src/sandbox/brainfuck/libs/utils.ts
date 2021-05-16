/** ********************** Utils ************************ */
export const ErrOutOfRange = (): Error => {
  const msg = 'Data pointer out of range.';
  if (RangeError) return new RangeError(msg);
  return new Error(msg);
};

export const MAX_DATA_COUNT = 30000;

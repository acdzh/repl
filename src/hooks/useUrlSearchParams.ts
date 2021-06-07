const useUrlSearchParams = (): {
  [property: string]: string;
} => {
  if (typeof window === 'undefined' || !window.location) {
    return {};
  }
  const urlSearchParams = new URLSearchParams(window.location.search);
  const r = {} as {
    [property: string]: string;
  };
  urlSearchParams.forEach((v: string, k: string) => {
    r[k] = v;
  });
  return r;
};

export default useUrlSearchParams;

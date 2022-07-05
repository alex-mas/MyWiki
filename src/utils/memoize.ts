export const memoize = <A, R>(fnc: (arg: A) => R, n: number) => {
  const fncCache = new Map<A, R>();
  return (arg: A) => {
    const cached = fncCache.get(arg);
    if (cached) {
      return cached;
    } else {
      const retVal = fnc(arg);
      if (fncCache.size >= n) {
        fncCache.delete(fncCache.keys().next().value);
      }
      fncCache.set(arg, retVal);
      return retVal;
    }
  }
}
export default memoize;
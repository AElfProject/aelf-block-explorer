import cacheData from 'memory-cache';
export async function fetchWithCache(ctx, key, fn, ...rest) {
  const value = cacheData.get(key);
  if (value) {
    return value;
  } else {
    const hours = 24;
    const res = await fn(ctx, ...rest);
    cacheData.put(key, res, hours * 1000 * 60 * 60);
    return res;
  }
}

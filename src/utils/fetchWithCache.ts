import cacheData from 'memory-cache';
export async function fetchWithCache(ctx, key, fn, ...rest) {
  const value = cacheData.get(key);
  console.log(value, 'xxxxx');
  if (value) {
    return value;
  } else {
    const hours = 24;
    console.log(key, fn, ...rest);
    const res = await fn(ctx, ...rest);
    cacheData.put(key, res, hours * 1000 * 60 * 60);
    console.log(res, 'yyyyy');
    return res;
  }
}

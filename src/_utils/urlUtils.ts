export function getPathnameFirstSlash(pathname) {
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const firstSlash = pathname.slice(0, secondSlashIndex + 1);
  return firstSlash;
}

/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-10-23 19:11:47
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-23 19:20:41
 * @Description: file content
 */

export function getPathnameFirstSlash(pathname) {
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const firstSlash = pathname.slice(0, secondSlashIndex + 1);
  return firstSlash;
}

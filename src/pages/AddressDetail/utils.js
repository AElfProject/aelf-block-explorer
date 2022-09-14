/**
 * @file utils
 * @author atom-yang
 */

export const detectMobileBrowser = () => !!(navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i));

export const useSearchParams = (search, key) => new URLSearchParams(search).get(key);

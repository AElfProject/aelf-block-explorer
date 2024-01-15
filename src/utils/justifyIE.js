/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-28 11:26:35
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-28 11:58:57
 * @Description: file content
 */
// todo: use let and const instead
export const isIESeries = () => {
  const { userAgent } = navigator; // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE || isEdge || isIE11) return true;
  return false;
};

export const IEVersion = () => {
  const { userAgent } = navigator; // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf('Edge') > -1 && !isIE; // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    const fIEVersion = parseFloat(RegExp.$1);
    if (fIEVersion == 7) {
      return 7;
    } if (fIEVersion == 8) {
      return 8;
    } if (fIEVersion == 9) {
      return 9;
    } if (fIEVersion == 10) {
      return 10;
    }
    return 6; // IE版本<=7
  } if (isEdge) {
    return 'edge'; // edge
  } if (isIE11) {
    return 11; // IE11
  }
  return -1; // 不是ie浏览器
};

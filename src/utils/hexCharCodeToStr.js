/**
 * @file hexCharCodeToStr.js
 * @author zhouminghui
 * 16进制转字符
 */

export default function hexCharCodeToStr(hexCharCodeStr) {
  if (typeof hexCharCodeStr !== 'string' || hexCharCodeStr.length % 2 !== 0) {
    throw Error('invalid input');
  }
  const trimedStr = hexCharCodeStr.trim();
  const rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
  const len = rawStr.length;
  if (len % 2 !== 0) {
    throw Error('Illegal Format ASCII Code!');
  }
  let curCharCode;
  const resultStr = [];
  for (let i = 0; i < len; i += 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join('');
}

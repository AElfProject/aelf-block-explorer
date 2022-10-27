/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-10-26 14:52:14
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-27 11:04:31
 * @FilePath: /aelf-block-explorer/src/utils/deviceCheck.ts
 * @Description: judge if is phone
 */

export const isPhoneCheckSSR = (headers) => {
  if (!headers) return false;
  const userAgentInfo = headers['user-agent'].toLowerCase();
  const agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod'];
  const phoneCheckResultSSR = agents.find((agent) => userAgentInfo.includes(agent));
  return phoneCheckResultSSR;
};
export const isPhoneCheck = () => {
  const userAgentInfo = navigator.userAgent.toLowerCase();
  const agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod'];
  const phoneCheckResult = agents.find((agent) => userAgentInfo.includes(agent));
  return phoneCheckResult;
};

let isIPhoneChecked = false;
let iPhoneCheckResult;
export const isIPhone = () => {
  if (!isIPhoneChecked) {
    const userAgentInfo = navigator.userAgent.toLowerCase();
    const agents = ['iphone', 'ipad', 'ipod'];
    isIPhoneChecked = true;
    iPhoneCheckResult = agents.find((agent) => userAgentInfo.includes(agent));
    return iPhoneCheckResult;
  }
  return iPhoneCheckResult;
};

/**
 * @file
 * @author
 */

export const isPhoneCheckSSR = (headers) => {
  if (!headers) return false;
  // 判断是否手机端访问
  const userAgentInfo = headers['user-agent'].toLowerCase();
  const agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod'];
  const phoneCheckResultSSR = agents.find((agent) => userAgentInfo.includes(agent));
  return phoneCheckResultSSR;
};
export const isPhoneCheck = () => {
  // 判断是否手机端访问
  const userAgentInfo = navigator.userAgent.toLowerCase();
  const agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod'];
  const phoneCheckResult = agents.find((agent) => userAgentInfo.includes(agent));
  return phoneCheckResult;
};

let isIPhoneChecked = false;
let iPhoneCheckResult = null;
export const isIPhone = () => {
  // 判断是否手机端访问
  if (!isIPhoneChecked) {
    const userAgentInfo = navigator.userAgent.toLowerCase();
    const agents = ['iphone', 'ipad', 'ipod'];
    isIPhoneChecked = true;
    iPhoneCheckResult = agents.find((agent) => userAgentInfo.includes(agent));
    return iPhoneCheckResult;
  }
  return iPhoneCheckResult;
};

export const isAndroid = () => {
  // TODO:
};

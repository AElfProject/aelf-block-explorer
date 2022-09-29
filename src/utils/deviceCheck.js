/**
 * @file
 * @author
 */

let isPhoneChecked = false,
  isPhoneCheckedSSR = false;
let phoneCheckResult = null,
  phoneCheckResultSSR = null;
export const isPhoneCheckSSR = (headers) => {
  // 判断是否手机端访问
  if (!isPhoneCheckedSSR) {
    const userAgentInfo = headers['user-agent'].toLowerCase();
    const agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod'];
    isPhoneCheckedSSR = true;
    phoneCheckResultSSR = agents.find((agent) => userAgentInfo.includes(agent));
    return phoneCheckResultSSR;
  }
  return phoneCheckResultSSR;
};
export const isPhoneCheck = () => {
  // 判断是否手机端访问
  if (!isPhoneChecked) {
    const userAgentInfo = navigator.userAgent.toLowerCase();
    const agents = ['android', 'iphone', 'symbianos', 'windows phone', 'ipad', 'ipod'];
    isPhoneChecked = true;
    phoneCheckResult = agents.find((agent) => userAgentInfo.includes(agent));
    return phoneCheckResult;
  }
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

/**
 * @file
 * @author
 */

let isPhoneChecked = false;
let phoneCheckResult = null;
export const isPhoneCheck = () => {
  // 判断是否手机端访问
  if (!isPhoneChecked) {
    const userAgentInfo = navigator.userAgent.toLowerCase();
    const agents = [
      "android",
      "iphone",
      "symbianos",
      "windows phone",
      "ipad",
      "ipod",
    ];
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
    const agents = ["iphone", "ipad", "ipod"];
    isIPhoneChecked = true;
    iPhoneCheckResult = agents.find((agent) => userAgentInfo.includes(agent));
    return iPhoneCheckResult;
  }
  return iPhoneCheckResult;
};

export const isAndroid = () => {
  // TODO:
};
const WIDTH_BOUNDARY = 942;
export const isPhoneCheckWithWindow = () => {
  const windowWidth = window.innerWidth;
  return isPhoneCheck() || windowWidth <= WIDTH_BOUNDARY;
};

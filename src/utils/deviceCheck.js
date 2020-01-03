/**
 * @file
 * @author
 */

let isPhoneChecked = false;
let phoneCheckResult = null;
export const isPhoneCheck = () => {
  //判断是否手机端访问
  if (!isPhoneChecked) {
    const userAgentInfo = navigator.userAgent.toLowerCase();
    const agents = ['android', 'iphone',
      'symbianos', 'windows phone',
      'ipad', 'ipod'];
    isPhoneChecked = true;
    phoneCheckResult = agents.find(agent => {
      return userAgentInfo.includes(agent);
    });
    return phoneCheckResult;
  }
  return phoneCheckResult;
};

export const isAndroid = () => {
  // TODO:
};

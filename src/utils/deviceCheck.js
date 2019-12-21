/**
 * @file
 * @author
 */

export const isPhoneCheck = () => {
  //判断是否手机端访问
  const userAgentInfo = navigator.userAgent.toLowerCase();
  const agents = ['android', 'iphone',
    'symbianos', 'windows phone',
    'ipad', 'ipod'];
  return agents.find(agent => {
    return userAgentInfo.includes(agent);
  });
};

export const isAndroid = () => {
  // TODO:
};

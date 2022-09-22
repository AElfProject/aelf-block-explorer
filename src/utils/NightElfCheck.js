/**
 * @file NightElfCheck
 * @author zhouminghui
 */
import isMobile from 'ismobilejs';
import NightElfCheckTemp from './NightElf/NightElfCheck';
import AelfBridgeCheck from './NightElf/AelfBridgeCheck';

const isPhone = typeof window !== 'undefined' ? isMobile(window.navigator).phone : true;

const NightElfCheck = isPhone ? AelfBridgeCheck : NightElfCheckTemp;
// const NightElfCheck = NightElfCheckTemp;
export default NightElfCheck;
export const getViewResult = (key, result) => {
  if (!result) {
    return undefined;
  }
  return result[key] || (result.result && result.result[key]);
};

/**
 * @file utils.js
 * @author zhouminghui
 * 减少开发页面进行变动时的import更改问题
 * Reduce import changes when developing pages change
 * // TODO: 怎么写这个utils最正确
*/

import addressOmit from './addressOmit';
import calculateCrossConnectorReturn from './calculateCrossConnectorReturn';
import checkPermissionRepeat from './checkPermissionRepeat';
import checkVote from './checkVote';
import contractChange from './contractChange';
import formateTurnoverList from './formateTurnoverList';
import getConsensus from './getConsensus';
import getContractAddress from './getContractAddress';
import getDividends from './getDividends';
import getEstimatedValueELF from './getEstimatedValueELF';
import getEstimatedValueRes from './getEstimatedValueRes';
import getFees from './getFees';
import getHexNumber from './getHexNumber';
import getLn from './getLn';
import getLogin from './getLogin';
import getMenuName from './getMenuName';
import getMyVoteData from './getMyVoteData';
import getNightElfAddressList from './getNightElfAddressList';
import getNightElfKeypairs from './getNightElfKeypairs';
import getPublicKey from './getPublicKey';
import getResource from './getResource';
import getStateJudgment from './getStateJudgment';
import hexCharCodeToStr from './hexCharCodeToStr';
import hexToArrayBuffer from './hexToArrayBuffer';
import NightElfCheck from './NightElfCheck';
import setNewPermission from './setNewPermission';

export {
    addressOmit,
    calculateCrossConnectorReturn,
    checkPermissionRepeat,
    checkVote,
    contractChange,
    formateTurnoverList,
    getConsensus,
    getContractAddress,
    getDividends,
    getEstimatedValueELF,
    getEstimatedValueRes,
    getFees,
    getHexNumber,
    getLn,
    getLogin,
    getMenuName,
    getMyVoteData,
    getNightElfAddressList,
    getNightElfKeypairs,
    getPublicKey,
    getResource,
    getStateJudgment,
    hexCharCodeToStr,
    hexToArrayBuffer,
    NightElfCheck,
    setNewPermission
};

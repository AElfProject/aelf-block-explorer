/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-21 20:43:03
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-27 18:47:29
 * @Description: the api of vote consensus and others vote need
 */
import { get } from '@src/utils';

export const getAllTeamDesc = () => {
  return get('/vote/getAllTeamDesc', {
    isActive: true
  });
};

export const getTeamDesc = publicKey => {
  return get('/vote/getTeamDesc', {
    publicKey
  });
};

export const fetchPageableCandidateInformation = (contract, payload) => {
  return contract.GetPageableCandidateInformation.call(payload);
};

export const fetchElectorVoteWithRecords = (contract, payload) => {
  return contract.GetElectorVoteWithRecords.call(payload);
};

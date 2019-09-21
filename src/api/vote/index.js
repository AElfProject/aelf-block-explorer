/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-21 20:43:03
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-21 21:53:07
 * @Description: file content
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

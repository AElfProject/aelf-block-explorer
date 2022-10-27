/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-27 10:57:15
 * @FilePath: /aelf-block-explorer/src/redux/features/proposal/proposalDetail.ts
 * @Description: set current organizations
 */

export const SET_MODIFY_ORG_DETAIL = 'SET_MODIFY_ORG_DETAIL';
export const setCurrentOrg = (org) => ({ type: SET_MODIFY_ORG_DETAIL, payload: org });

/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-27 11:02:55
 * @FilePath: /aelf-block-explorer/src/redux/features/vote/contracts.ts
 * @Description: file content
 */

import { observable, action, configure } from 'mobx';

configure({ enforceActions: 'always' });

class ContractStore {
  @observable
  consensusContract = null;

  @observable
  dividendContract = null;

  @observable
  multiTokenContract = null;

  @observable
  voteContract = null;

  @observable
  electionContract = null;

  @observable
  profitContract = null;

  @action
  setContract(name, contract) {
    this[name] = contract;
  }
}

export default new ContractStore();

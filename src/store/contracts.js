/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-19 15:50:41
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-19 21:02:29
 * @Description: file content
 */
import {
  observable, action, configure, runInAction,
} from 'mobx';

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

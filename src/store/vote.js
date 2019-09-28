/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-18 18:11:12
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-18 21:26:51
 * @Description: file content
 */
import { observable, action, configure, runInAction } from 'mobx';

configure({ enforceActions: 'always' });

class VoteStore {
  @observable
  pluginLockModalVisible = false;

  @action
  setPluginLockModalVisible(flag) {
    this.pluginLockModalVisible = flag;
  }
}

export default new VoteStore();

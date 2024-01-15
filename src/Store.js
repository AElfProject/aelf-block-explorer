/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-22 11:03:09
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-18 18:05:33
 * @Description: file content
 */
import {
  types,
} from 'mobx-state-tree';
import keys from 'lodash/keys';
import { Component } from 'react';
import {
  TXSSTATUS,
} from './constants';

// response is sorted
// function sortBlocks(blocks) {
//     return blocks.sort((a, b) => (+a.block_height - (+b.block_height)));
// }

const BlockInfoStore = types.model('BlockInfoStore', {
  block_hash: types.optional(types.string, ''),
  block_height: types.optional(types.identifierNumber, 0),
  chain_id: types.optional(types.string, ''),
  merkle_root_state: types.optional(types.string, ''),
  merkle_root_tx: types.optional(types.string, ''),
  pre_block_hash: types.optional(types.string, ''),
  time: types.optional(types.string, ''),
  tx_count: types.optional(types.number, 0),
  transactions: types.optional(types.array(types.string), []),
});

export const BlocksStore = types.model('BlocksStore', {
  blocks: types.array(BlockInfoStore),
  total: types.number,
})
  .views((self) => ({
    // get sortedAvailableBlocks() {
    //     return sortBlocks(values(self.books))
    // },
    findBlockByHeight(height) {
      return self.blocks.filter(t.block_height === height);
    },
  }))
  .actions((self) => ({
    addBlock(block) {
      self.blocks.unshift(block);
    },
  }));

const TxStore = types.model('TxStore', {
  address_from: types.optional(types.string, ''),
  address_to: types.optional(types.string, ''),
  block_hash: types.optional(types.string, ''),
  block_height: types.optional(types.number, 0),
  increment_id: types.optional(types.number, 0),
  method: types.optional(types.string, ''),
  params: types.optional(types.string, ''),
  tx_id: types.optional(types.string, ''),
  tx_status: types.optional(types.enumeration('Status', keys(TXSSTATUS)), 'NotExisted'),
});

export const TxsStore = types.model('TxsStore', {
  transactions: types.array(TxStore),
  total: types.number,
})
  .views((self) => ({
    findTxById(id) {
      return self.txs.filter((t) => t.chain_id === id);
    },
  }))
  .actions((self) => ({
    addTx(tx) {
      self.transactions.push(tx);
    },
  }));

export const PathnameStore = types.model('PathnameStore', {
  key: types.optional(types.string, ''),
}).actions((self) => ({
  changeKey(key) {
    self.key = key;
  },
}));

// save increament realtime data
export const AppIncrStore = types.model('AppIncrStore', {
  blockList: types.optional(BlocksStore, {
    blocks: [],
    total: 0,
  }),
  txsList: types.optional(TxsStore, {
    transactions: [],
    total: 0,
  }),
  patheName: types.optional(PathnameStore, {
    key: '',
  }),
});

// Demo
// import { observer, inject } from "mobx-react";
// @inject("appIncrStore")
// @observer
// export default class HomePage extends Component {
// // 引用 const store = this.props.appIncrStore;
// // 写入 store.blockList.addBlock(chainBlocks); // 如何声明见40行

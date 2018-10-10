import {
    types
} from 'mobx-state-tree';
import keys from 'lodash/keys';
import {
    TXSSTATUS
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
    transactions: types.optional(types.array(types.string), [])
});

export const BlocksStore = types.model('BlocksStore', {
        blocks: types.array(BlockInfoStore),
        total: types.number
    })
    .views(self => ({
        // get sortedAvailableBlocks() {
        //     return sortBlocks(values(self.books))
        // },
        findBlockByHeight(height) {
            return self.blocks.filter(t.block_height === height);
        }
    }))
    .actions(self => ({
        addBlock(block) {
            self.blocks.push(block);
        }
    }))

const TxStore = types.model('TxStore', {
    address_from: types.optional(types.string, ''),
    address_to: types.optional(types.string, ''),
    block_hash: types.optional(types.string, ''),
    block_height: types.optional(types.number, 0),
    increment_id: types.optional(types.number, 0),
    method: types.optional(types.string, ''),
    params: types.optional(types.string, ''),
    tx_id: types.optional(types.string, ''),
    tx_status: types.optional(types.enumeration('Status', keys(TXSSTATUS)), 'NotExisted')
});

export const TxsStore = types.model('TxsStore', {
        transactions: types.array(TxStore),
        total: types.number
    })
    .views(self => ({
        findTxById(id) {
            return self.txs.filter(t => t.chain_id === id);
        }
    }))
    .actions(self => ({
        addTx(tx) {
            self.transactions.push(tx);
        }
    }));

// save increament realtime data
export const AppIncrStore = types.model('AppIncrStore', {
    blockList: types.optional(BlocksStore, {
        blocks: [],
        total: 0
    }),
    txsList: types.optional(TxsStore, {
        transactions: [],
        total: 0
    })
})
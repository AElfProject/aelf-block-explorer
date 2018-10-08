import {
    values
} from 'mobx';
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
    block_hash: types.string,
    block_height: types.identifier,
    chain_id: types.string,
    merkle_root_state: types.string,
    merkle_root_tx: types.string,
    pre_block_hash: types.string,
    time: types.Date,
    tx_count: types.number
});

export const BlocksStore = types.model('BlocksStore', {
        blocks: types.array(BlockInfoStore)
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
            self.blocks.unshift(block)
        }
    }))

const TxStrore = types.model('TxStrore', {
    address_from: types.string,
    address_to: types.string,
    block_hash: types.string,
    block_height: types.number,
    chain_id: types.string,
    increment_id: types.number,
    method: types.string,
    params: types.optional(types.string, ''),
    params_to: types.optional(types.string, ''),
    quantity: types.number,
    tx_id: types.string,
    tx_status: types.enumeration('Status', keys(TXSSTATUS))
});

export const TxsStore = types.model('TxsStore', {
        txs: types.array(TxStrore)
    })
    .views(self => ({
        findTxById(id) {
            return self.txs.filter(t => t.chain_id === id);
        }
    }))
    .actions(self => ({
        addTx(tx) {
            self.txs.unshift(tx)
        }
    }))
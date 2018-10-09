import {
    types,
    flow,
    applyPatch,
    applySnapshot
} from 'mobx-state-tree';
import keys from 'lodash/keys';
import isEmpty from 'lodash/isEmpty';
import {
    TXSSTATUS,
    PAGE_SIZE,
    ALL_BLOCKS_API_URL,
    ALL_TXS_API_URL
} from './constants';
import {
    get
} from './utils';

// response is sorted
// function sortBlocks(blocks) {
//     return blocks.sort((a, b) => (+a.block_height - (+b.block_height)));
// }

const fetch = async (url) => {
    const res = await get(url, {
        page: 0,
        limit: PAGE_SIZE,
        order: "desc"
    });

    return res;
}

const BlockInfoStore = types.model('BlockInfoStore', {
    block_hash: types.optional(types.string, ''),
    block_height: types.optional(types.identifierNumber, 0),
    chain_id: types.optional(types.string, ''),
    merkle_root_state: types.optional(types.string, ''),
    merkle_root_tx: types.optional(types.string, ''),
    pre_block_hash: types.optional(types.string, ''),
    time: types.optional(types.string, ''),
    tx_count: types.optional(types.number, 0)
});

export const BlocksStore = types.model('BlocksStore', {
        blocks: types.array(BlockInfoStore),
        total: types.optional(types.number, 0)
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
        load: flow(function* load(cb) {
            const res = yield fetch(ALL_BLOCKS_API_URL);

            applySnapshot(self, res);
            cb();
        }),
        addBlock(block) {
            self.blocks.unshift(block);
            self.total = self.blocks.length;
        }
    }))

const TxStore = types.model('TxStore', {
    address_from: types.optional(types.string, ''),
    address_to: types.optional(types.string, ''),
    block_hash: types.optional(types.string, ''),
    block_height: types.optional(types.number, 0),
    chain_id: types.optional(types.string, ''),
    increment_id: types.optional(types.number, 0),
    method: types.optional(types.string, ''),
    params: types.optional(types.string, ''),
    params_to: types.optional(types.string, ''),
    quantity: types.optional(types.number, 0),
    tx_id: types.optional(types.string, ''),
    tx_status: types.optional(types.enumeration('Status', keys(TXSSTATUS)), 'NotExisted')
});

export const TxsStore = types.model('TxsStore', {
        transactions: types.array(TxStore),
        total: types.optional(types.number, 0)
    })
    .views(self => ({
        findTxById(id) {
            return self.txs.filter(t => t.chain_id === id);
        }
    }))
    .actions(self => ({
        load: flow(function* load(cb) {
            const res = yield fetch(ALL_TXS_API_URL);
            applySnapshot(self, res);
            cb();
        }),
        addTx(tx) {
            self.transactions.unshift(tx);
            self.total = self.transactions.length;
        }
    }));

export const AppStore = types.model('AppStore', {
    blockList: types.optional(BlocksStore, {
        blocks: []
    }),
    txsList: types.optional(TxsStore, {
        transactions: []
    })
})
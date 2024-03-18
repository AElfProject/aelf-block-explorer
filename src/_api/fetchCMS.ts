import request from '@_api';

export async function fetchCMS() {
  const result = await request.cms.getGlobalConfig();
  const { data } = result;
  // const data = {
  //   footerMenuList: {
  //     date_created: '2024-02-20T07:53:12.000Z',
  //     date_updated: null,
  //     id: 1,
  //     index: 1,
  //     label: 'AELF Ecosystem',
  //     user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //     user_updated: null,
  //     children: [
  //       {
  //         date_created: '2024-02-20T07:53:38.000Z',
  //         date_updated: null,
  //         id: 1,
  //         index: 1,
  //         label: 'aelf.io',
  //         parent: 1,
  //         path: 'https://aelf.io',
  //         user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //         user_updated: null,
  //       },
  //       {
  //         date_created: '2024-02-20T07:54:07.000Z',
  //         date_updated: null,
  //         id: 2,
  //         index: 1,
  //         label: 'Wallet',
  //         parent: 1,
  //         path: 'https://baidu.com',
  //         user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //         user_updated: null,
  //       },
  //     ],
  //   },
  //   headerMenuList: [
  //     {
  //       date_created: '2024-02-20T07:45:37.000Z',
  //       date_updated: null,
  //       id: 1,
  //       index: 1,
  //       path: '/',
  //       label: 'Home',
  //       user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //       user_updated: null,
  //       children: [],
  //     },
  //     {
  //       date_created: '2024-02-20T07:46:18.000Z',
  //       date_updated: '2024-02-20T07:47:36.000Z',
  //       id: 2,
  //       index: 2,
  //       path: 'blockchain',
  //       label: 'Blockchain',
  //       user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //       user_updated: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //       children: [
  //         {
  //           date_created: '2024-02-20T07:48:42.000Z',
  //           date_updated: null,
  //           id: 1,
  //           index: 1,
  //           path: '/blocks',
  //           label: 'Blocks',
  //           parent: 2,
  //           user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //           user_updated: null,
  //         },
  //         {
  //           date_created: '2024-02-20T07:51:05.000Z',
  //           date_updated: null,
  //           id: 2,
  //           index: 1,
  //           path: '/txs',
  //           label: 'Transactions',
  //           parent: 2,
  //           user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //           user_updated: null,
  //         },
  //         {
  //           date_created: '2024-02-20T07:51:34.000Z',
  //           date_updated: null,
  //           id: 3,
  //           index: 1,
  //           path: '/address',
  //           label: 'Top Accounts',
  //           parent: 2,
  //           user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //           user_updated: null,
  //         },
  //         {
  //           date_created: '2024-02-20T07:51:49.000Z',
  //           date_updated: '2024-02-20T07:51:57.000Z',
  //           id: 4,
  //           index: 1,
  //           path: '/contracts',
  //           label: 'Contracts',
  //           parent: 2,
  //           user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //           user_updated: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //         },
  //       ],
  //     },
  //     {
  //       date_created: '2024-02-20T07:47:57.000Z',
  //       date_updated: null,
  //       id: 3,
  //       index: 1,
  //       path: 'tokens',
  //       label: 'Tokens',
  //       user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //       user_updated: null,
  //       children: [],
  //     },
  //     {
  //       date_created: '2024-02-20T07:48:16.000Z',
  //       date_updated: null,
  //       id: 4,
  //       index: 1,
  //       path: 'nfts',
  //       label: 'NFTs',
  //       user_created: '601de255-1d56-4614-af07-0a3bfa682bcf',
  //       user_updated: null,
  //       children: [],
  //     },
  //     {
  //       path: 'governance',
  //       label: 'Governance',
  //       children: [
  //         {
  //           path: '/proposal/proposals',
  //           label: 'Proposal',
  //         },
  //         {
  //           path: '/vote/election',
  //           label: 'Vote',
  //         },
  //         {
  //           path: '/resource',
  //           label: 'Resource',
  //         },
  //       ],
  //     },
  //   ],
  //   chainList: {
  //     defaultChain: 'AELF',
  //     chainList: [
  //       {
  //         label: 'MainChain AELF',
  //         key: 'AELF',
  //       },
  //       {
  //         label: 'SideChain tDVV',
  //         key: 'tDVW',
  //       },
  //     ],
  //   },
  //   networkList: [
  //     {
  //       label: 'AELF Mainnet',
  //       key: 'MAINNET',
  //       path: 'https://explorer.aelf.io',
  //     },
  //     {
  //       label: 'AELF Testnet',
  //       key: 'TESTNET',
  //       path: 'https://explorer-test.aelf.io',
  //     },
  //   ],
  // };
  return data;
}

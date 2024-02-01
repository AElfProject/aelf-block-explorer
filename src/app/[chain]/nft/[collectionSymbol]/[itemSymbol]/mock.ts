import { HolderItem, IActivityTableData, ItemSymbolDetailActivity, ItemSymbolDetailHolders, ItemSymbolDetailOverview } from "./type";
import Logo from 'public/next.svg';

const activeList: IActivityTableData[] = Array.from(new Array(100).keys()).map((item) => {
  return {
    transactionHash: item + 'cc764efe0d5b8f9a73fffa3aecc7e3a26d715a715a764af464dd80dd7f2ca03e',
    status: 'Fail',
    action: 'Sales',
    timestamp: '2023-08-15T08:42:41.1123602Z',
    price: 1001,
    amount: 11,
    from: {
      name: 'AELF',
      address: 'YgRDkJECvrJsfcrM3KbjMjNSPfZPhmbrPjTpssWiWZmGxGiWy',
      addressType: 0,
      isManager: false,
      isProducer: true
    },
    to: {
      name: 'AELF',
      address: 'AELF.Contract.Token',
      addressType: 0,
      isManager: false,
      isProducer: true
    },
    "marketPlaces": {
      "marketName": "",
      "marketLogo": "",
      "marketUrl": ""
    }
  };
});
async function fetchActiveData({ page, pageSize }): Promise<ItemSymbolDetailActivity> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    list: activeList.slice((page - 1) * pageSize, page * pageSize),
  };
}

const holderList: HolderItem[] = Array.from(new Array(100).keys()).map((item) => {
  return {
    rank: 10,
    "address": {
      "name": "",
      "address": "",
      "addressType": 0,
      "isManager": false,
      "isProducer": true
    },
    "quantity": 1000.21,
    "percentage": 0.34
  };
});
async function fetchHolderData({ page, pageSize }): Promise<ItemSymbolDetailHolders> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    total: 100,
    list: holderList.slice((page - 1) * pageSize, page * pageSize),
  };
}
const overview: ItemSymbolDetailOverview = {
  nftCollection: {
    "name": 'string',
    "imageUrl": Logo,
    "symbol": 'string'
  },
  item: {
    "name": 'string',
    "imageUrl": Logo,
    "symbol": 'string'
  },
  owner: [
    "address1",
    "address2"
  ],
  holders: 100,
  issuer: [
    "address1",
    "address2"
  ],
  tokenSymbol: 'string',
  quantity: 100,
  marketPlaces: {
    "marketName": "name",
    "marketLogo": Logo,
    "marketUrl": ""
  },
  isSeed: false,
  symbolToCreate: 'string',
  expires: 'string',
  properties: {
    total: 100,
    list: [
      {
        title: '123',
        value: '123'
      }
    ]
  },
  description: 'Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is a collaborative.Into the Metaverse is',
}
const fetchOverviewData = async (): Promise<ItemSymbolDetailOverview> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return overview;
}
export { activeList, overview, holderList, fetchActiveData, fetchHolderData, fetchOverviewData };

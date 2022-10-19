import TxsDetail from 'page-components/TxsDetail/TransactionDetail';
import { NextPageContext } from 'next';
import { aelf } from 'utils/axios';
import { getContractNames, deserializeLog, getFee, removeAElfPrefix } from 'utils/utils';
import { IInfo } from 'page-components/TxsDetail/types';
let redirectRes, contractNameSSR;
const getLastHeight = async () => {
  return aelf.chain
    .getChainStatus()
    .then(({ LastIrreversibleBlockHeight }) => {
      return LastIrreversibleBlockHeight;
    })
    .catch((_) => {
      redirectRes = '/search-failed';
    });
};
const getInfoBackUp = async (transaction) => {
  const { BlockNumber } = transaction;
  const block = await aelf.chain.getBlockByHeight(BlockNumber, false).catch((_) => {
    redirectRes = '/search-failed';
    return;
  });
  const {
    Header: { Time },
  } = block;
  return {
    ...(await getFee(transaction)),
    time: Time,
  };
};
const getData = async (res) => {
  const names = await getContractNames().catch((_) => {
    redirectRes = '/search-failed';
    return;
  });
  const { isSystemContract, contractName } = names[res.Transaction.To] || {};
  const name = isSystemContract ? removeAElfPrefix(contractName) : contractName;
  contractNameSSR = name || res.Transaction.To;
  const backup = await getInfoBackUp(res);
  return { ...res, ...backup };
};
const getTxResult = async (id) => {
  return aelf.chain
    .getTxResult(id)
    .then((res) => {
      if (res.Status === 'NOTEXISTED') {
        redirectRes = '/search-invalid/' + res.TransactionId;
      } else {
        return getData(res);
      }
    })
    .catch((_) => {
      redirectRes = '/search-failed';
    });
};
const getParseLog = async (info: IInfo) => {
  const { Logs = [] } = info || {};
  const logs: any[] = [];
  if (Logs.length) {
    const arr = Logs.filter((item) => item.Name === 'Transferred');
    return arr.forEach((item, index) => {
      deserializeLog(item).then((res) => {
        logs.push({ ...res, key: arr[index].Name + arr[index].Address });
        return [...logs];
      });
    });
  } else {
    return [];
  }
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const { id } = ctx.query;
  const lastHeight = await getLastHeight();
  const info = await getTxResult(id);
  const parseLog = await getParseLog(info);
  if (redirectRes) {
    return {
      redirect: {
        permanent: false,
        destination: redirectRes,
      },
    };
  }

  // without JSON.parse and JSON.stringify
  // throw error that `SerializableError: Error serializing`
  return {
    props: {
      lastheightssr: lastHeight,
      infossr: JSON.parse(JSON.stringify(info)),
      parselogssr: JSON.parse(JSON.stringify(parseLog)),
      contractnamessr: contractNameSSR,
      headers,
    },
  };
};
export default TxsDetail;

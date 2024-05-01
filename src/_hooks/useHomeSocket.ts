import { useEffect, useMemo, useState } from 'react';
import Socket from '@_socket';
import { IBlocksResponseItem, ITransactionsResponseItem, TChainID } from '@_api/type';
interface IIntervalData {
  blocks: Array<IBlocksResponseItem>;
  transactions: ITransactionsResponseItem[];
  blocksLoading: boolean;
  transactionsLoading: boolean;
}
const useHomeSocket = (chain: TChainID) => {
  const [blocks, setBlocks] = useState<Array<IBlocksResponseItem>>([]);
  const [transactions, setTransactions] = useState<ITransactionsResponseItem[]>([]);
  const [blocksLoading, setBlocksLoading] = useState<boolean>(true);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  console.log('signalR----------refresh');
  const socket = Socket();

  const data: IIntervalData = useMemo(() => {
    // console.log('xxxxx', isCanBeBid, auctionInfo?.finishIdentifier);
    return {
      blocks,
      blocksLoading,
      transactionsLoading,
      transactions,
    };
  }, [blocks, blocksLoading, transactions, transactionsLoading]);

  useEffect(() => {
    function fetchAndReceiveWs() {
      if (!socket) {
        return;
      }

      socket.registerHandler('ReceiveLatestBlocks', (data) => {
        console.log('blocks---1', data);
        setBlocks(data?.blocks || []);
        setBlocksLoading(false);
      });
      socket.registerHandler('ReceiveLatestTransactions', (data) => {
        setTransactions(data.transactions);
        console.log('transactions---2', data);
        setTransactionsLoading(false);
      });
      socket.sendEvent('RequestLatestTransactions', { chainId: chain });
      socket.sendEvent('RequestLatestBlocks', { chainId: chain });
    }

    fetchAndReceiveWs();

    return () => {
      console.log('signalR----destroy');
      socket?.destroy();
      // socket?.sendEvent('UnSubscribeLatestTransactions');
      // socket?.sendEvent('UnSubscribeLatestBlocks');
    };
  }, [chain, socket]);

  return data;
};

export default useHomeSocket;

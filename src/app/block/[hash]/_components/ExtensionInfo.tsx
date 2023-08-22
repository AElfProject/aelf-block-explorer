/*
 * @author: Peterbjx
 * @Date: 2023-08-17 17:32:38
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:29:06
 * @Description: extensionInfo
 */
import DetailContainer from '@_components/DetailContainer';
import CodeBlock from '@_components/CodeBlock';
import { useMemo } from 'react';
import { DetailData } from './type';
export default function ExtensionInfo({ data }: { data: DetailData }) {
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Hash ',
        tip: 'Hash ',
        value: data.blockHash,
      },
      {
        label: 'Previous Hash ',
        tip: 'Previous Hash ',
        value: <span className="text-link">{data.previousBlockHash}</span>,
      },
      {
        label: 'Merkle Tree Root OF Transactions ',
        tip: 'Merkle Tree Root OF Transactions ',
        value: data.merkleTreeRootOfTransactions,
      },
      {
        label: 'Merkle Tree Root OF World State ',
        tip: 'Merkle Tree Root OF World State ',
        value: data.merkleTreeRootOfWorldState,
      },
      {
        label: 'Merkle Tree Root OF Transaction State ',
        tip: 'Merkle Tree Root OF Transaction State ',
        value: data.merkleTreeRootOfTransactionState,
      },
      {
        label: 'Extra Info ',
        tip: 'Extra Info ',
        value: <CodeBlock value={data.extra} />,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
    ];
  }, [data]);

  return <DetailContainer infoList={renderInfo} />;
}

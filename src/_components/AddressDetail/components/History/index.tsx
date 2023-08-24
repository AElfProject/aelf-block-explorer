import addressFormat from '@_utils/urlUtils';
import { useState } from 'react';
import { IHistory } from './type';
import { formatDate, validateVersion } from '@_utils/formatter';
import './index.css';
import { useEffectOnce } from 'react-use';
import fetchData from './mock';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
useRouter;
enum EventMapEnum {
  CodeUpdated = 'Code Updated',
  AuthorChanged = 'Author Changed',
  ContractDeployed = 'Contract Deployed',
}
export default function History({ SSRData = [], onTabClick }: { SSRData: IHistory[]; onTabClick: (string) => void }) {
  const [history, setHistory] = useState<IHistory[]>(SSRData);
  const router = useRouter();
  useEffectOnce(() => {
    async function getData() {
      const res = await fetchData();
      setHistory(res);
    }
    getData();
  });
  const StepDescription = (props) => {
    const { address, author, codeHash, txId, version, updateTime, blockHeight, onTabClick } = props;
    return (
      <>
        <div className="description-item">
          <span className="label">Author: </span>
          <div
            className="text-link text-xs leading-5"
            onClick={() => {
              if (author !== address) router.push('`/address/${addressFormat(author)}#contract`');
              onTabClick('contract');
            }}>
            {addressFormat(author)}
          </div>
        </div>
        <div className="description-item">
          <span className="label">Code Hash: </span>
          <div className="value">{codeHash}</div>
        </div>
        <div className="description-item">
          <span className="label">Version: </span>
          <div className="value">{validateVersion(version) ? version : '-'}</div>
        </div>
        <div className="description-item">
          <span className="label">Transaction Hash: </span>
          <Link className="text-link text-xs leading-5" href={`/tx/${txId}`}>
            {txId}
          </Link>
        </div>
        <div className="description-item">
          <span className="label">Date Time : </span>
          <div className="value">{formatDate(updateTime, 'Date Time (UTC)', 'YYYY-MM-DD HH:mm:ss A (UTC)')}</div>
        </div>
        <div className="description-item">
          <span className="label">Block: </span>
          <Link className="text-link text-xs leading-5" href={`/block/${blockHeight}`}>
            {blockHeight}
          </Link>
        </div>
      </>
    );
  };
  const items = history?.map((v, index) => {
    return {
      key: v.id,
      title: (
        <>
          <div className={clsx(index === 0 ? 'active-bot' : 'disabled-bot', 'history-bot')}></div>
          <div className="header-title">{EventMapEnum[v.event]}</div>
        </>
      ),
      description: StepDescription({ ...v, isLast: index === 0, onTabClick }),
    };
  });
  return (
    <div className="history-pane">
      {items.map((item, index) => {
        return (
          <div key={item.key} className="history-item">
            <div className="header">{item.title}</div>
            <div className={clsx(index === items.length - 1 && 'history-description-last', 'history-description')}>
              {item.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}

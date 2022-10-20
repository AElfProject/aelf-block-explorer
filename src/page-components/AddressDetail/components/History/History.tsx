import { Skeleton, Steps } from 'antd';
import moment from 'moment';
import React from 'react';
import Link from 'next/link';
import config from 'constants/config/config';

require('./History.styles.less');

const EventMap = {
  CodeUpdated: 'Code Updated',
  AuthorChanged: 'Author Changed',
  ContractDeployed: 'Contract Deployed',
};

export default function History({ history }) {
  const CHAIN_ID = config.CHAIN_ID;
  const StepDescription = (props) => {
    const { address, author, codeHash, txId, version, blockHeight, isLast } = props;
    return (
      <>
        <div className="description-item">
          <span>Author: </span>
          <Link href={`/address/${author}`}>{`ELF_${author}_${CHAIN_ID}`}</Link>
        </div>
        <div className="description-item">
          <span>Code Hash: </span>
          <Link href={`/address/${address}${isLast ? '' : `/${codeHash}`}`}>{codeHash}</Link>
        </div>
        <div className="description-item">
          <span>Version: </span>
          <Link href={`/address/${address}${isLast ? '' : `/${codeHash}`}`}>{version}</Link>
        </div>
        <div className="description-item">
          <span>Transaction Hash: </span>
          <Link href={`/tx/${txId}`}>{txId}</Link>
        </div>
        <div className="description-item">
          <span>Block: </span>
          <Link href={`/block/${blockHeight}`}>{blockHeight}</Link>
        </div>
      </>
    );
  };

  return (
    <div className="history-pane">
      {history ? (
        <Steps progressDot current={0} direction="vertical">
          {history.map((v, index) => (
            <Steps.Step
              key={v.txId}
              title={EventMap[v.event]}
              subTitle={moment(v.updateTime).format('YYYY/MM/DD HH:mm:ss')}
              description={StepDescription({ ...v, isLast: index === 0 })}
            />
          ))}
        </Steps>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}

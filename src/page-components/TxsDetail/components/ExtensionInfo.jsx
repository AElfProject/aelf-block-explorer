import React, { useMemo } from 'react';
import CodeBlock from '../../../components/CodeBlock/CodeBlock';

export default function ExtensionInfo({ transaction, show = false }) {
  const extensionInfo = useMemo(
    () =>
      transaction
        ? [
            ['Bloom', <CodeBlock key={transaction.Bloom} value={transaction.Bloom} />],
            ['Transaction Ref Block Number', transaction.Transaction.RefBlockNumber],
            ['Transaction Ref Block Prefix', transaction.Transaction.RefBlockPrefix],
            [
              'Transaction Params',
              <CodeBlock key={transaction.Transaction.Params} value={transaction.Transaction.Params} />,
            ],
            ['Transaction Signature', transaction.Transaction.Signature],
            ['Return Value', transaction.ReturnValue],
            ['Error', transaction.Error || 'null'],
            ['Transaction Size', `${transaction.TransactionSize} Bytes`],
          ]
        : [],
    [transaction],
  );
  return transaction && show ? (
    <div className="wrap extension-info">
      {extensionInfo.map((item, index) => {
        return (
          <div key={index} className="row">
            <p className="label">{item[0]} : </p>
            <div className="value">{item[1]}</div>
          </div>
        );
      })}
    </div>
  ) : (
    <></>
  );
}

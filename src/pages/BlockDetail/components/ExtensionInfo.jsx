import React, { useMemo } from "react";
import CodeBlock from "../../../components/CodeBlock/CodeBlock";

export default function ExtensionInfo({ extensionInfo }) {
  const renderObj = useMemo(
    () =>
      extensionInfo
        ? {
            "Block Size": `${(
              extensionInfo.blockSize || "0"
            ).toLocaleString()} Bytes`,
            "Merkle Tree Root Of Transactions":
              extensionInfo.merkleTreeRootOfTransactions,
            "Merkle Tree Root Of World State":
              extensionInfo.merkleTreeRootOfWorldState,
            "Merkle Tree Root Of Transaction State":
              extensionInfo.merkleTreeRootOfTransactionState,
            Extra: <CodeBlock value={extensionInfo.extra} />,
            Bloom: <CodeBlock value={extensionInfo.bloom} />,
            "Signer Pubkey": extensionInfo.signerPubkey,
          }
        : {},
    [extensionInfo]
  );

  return (
    <div className="wrap basic">
      {(Object.keys(renderObj) || []).map((key, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="row">
            <p className="label">{key} : </p>
            <div className="value">{renderObj[key]}</div>
          </div>
        );
      })}
    </div>
  );
}

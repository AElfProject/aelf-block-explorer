// eslint-disable-next-line no-use-before-define
import React from "react";
import { Skeleton, Steps } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import addressFormat from "../../../../utils/addressFormat";
import { validateVersion } from "../../../../utils/regExps";

import "./History.styles.less";

const EventMap = {
  CodeUpdated: "Code Updated",
  AuthorChanged: "Author Changed",
  ContractDeployed: "Contract Deployed",
};

export default function History({ history }) {
  const StepDescription = (props) => {
    const {
      address,
      author,
      codeHash,
      txId,
      version,
      blockHeight,
      isLast,
      onTabClick,
    } = props;
    return (
      <>
        <div className="description-item">
          <span>Author: </span>
          <Link
            to={`/address/${addressFormat(author)}#contract`}
            onClick={() => {
              if (author !== address) return;
              onTabClick("contract");
            }}
          >
            {addressFormat(author)}
          </Link>
        </div>
        <div className="description-item">
          <span>Code Hash: </span>
          <Link
            to={`/address/${addressFormat(address)}${
              isLast ? "" : `/${codeHash}`
            }#contract`}
            onClick={() => {
              onTabClick("contract");
            }}
          >
            {codeHash}
          </Link>
        </div>
        <div className="description-item">
          <span>Version: </span>
          <Link
            to={`/address/${addressFormat(address)}${
              isLast ? "" : `/${codeHash}`
            }#contract`}
            onClick={() => {
              onTabClick("contract");
            }}
          >
            {validateVersion(version) ? version : "-"}
          </Link>
        </div>
        <div className="description-item">
          <span>Transaction Hash: </span>
          <Link to={`/tx/${txId}`}>{txId}</Link>
        </div>
        <div className="description-item">
          <span>Block: </span>
          <Link to={`/block/${blockHeight}`}>{blockHeight}</Link>
        </div>
      </>
    );
  };
  const items = history?.map((v, index) => {
    return {
      key: v.txId,
      title: EventMap[v.event],
      subTitle: moment(v.updateTime).format("YYYY/MM/DD HH:mm:ss"),
      description: StepDescription({ ...v, isLast: index === 0 }),
    };
  });

  return (
    <div className="history-pane">
      {history ? (
        <Steps progressDot current={0} direction="vertical" items={items} />
      ) : (
        <Skeleton />
      )}
    </div>
  );
}

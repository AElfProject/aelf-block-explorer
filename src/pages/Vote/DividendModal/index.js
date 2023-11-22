import React, { Fragment, useMemo } from "react";
import { If, Then, Else } from "react-if";
import { Spin, Row, Col, Modal, Button } from "antd";
import Dividends from "../../../components/Dividends";

import "./index.less";

function getTokenCounts(dividend) {
  const { amounts = [] } = dividend;
  return (amounts || []).map((item) =>
    Object.keys(item.amounts || {}).reduce(
      (acc, key) => acc + item.amounts[key],
      0
    )
  );
}

const DividendModal = (props) => {
  const {
    dividendModalVisible,
    changeModalVisible,
    dividends,
    handleClaimDividendClick,
    loading,
    claimLoading,
    setClaimLoading,
  } = props;
  const tokenCounts = useMemo(() => getTokenCounts(dividends), [dividends]);
  console.log(dividends.amounts, "dividends.amounts");
  return (
    <Modal
      className="dividend-modal"
      title="Governance Rewards"
      visible={dividendModalVisible}
      onOk={() => {
        changeModalVisible("dividendModalVisible", false);
      }}
      onCancel={() => {
        changeModalVisible("dividendModalVisible", false);
      }}
      okText="Get!"
      width={543}
      centered
      maskClosable
      keyboard
      footer={null}
    >
      <If condition={!!loading}>
        <Then>
          <Spin spinning={loading} />
        </Then>
        <Else>
          <>
            {dividends.amounts.map((item, index) => (
              <div
                key={item.type}
                className="claim-profit-item"
                justify="space-between"
              >
                <div className="text-left">
                  <span className="profit-item-key">{item.title}: </span>
                </div>
                <div className="text-center">
                  <Dividends
                    className="profit-item-value"
                    dividends={item.amounts}
                  />
                </div>
                <div className="text-right">
                  <Button
                    disabled={tokenCounts[index] === 0}
                    type="primary"
                    loading={claimLoading}
                    onClick={() => {
                      setClaimLoading(true);
                      handleClaimDividendClick(item.schemeId);
                    }}
                  >
                    Claim Profit
                  </Button>
                </div>
              </div>
            ))}
          </>
        </Else>
      </If>
    </Modal>
  );
};

export default DividendModal;

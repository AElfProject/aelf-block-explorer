import { Button, Modal } from "antd";
// eslint-disable-next-line no-use-before-define
import React from "react";

// eslint-disable-next-line react/prop-types
const ContractProposalModal = ({ applyModal, contractModalCancle }) => (
  <Modal
    wrapClassName="contract-proposal-modal"
    closable={false}
    maskClosable={false}
    width={720}
    footer={
      <Button type="primary" onClick={contractModalCancle}>
        OK
      </Button>
    }
    {...applyModal}
    onOk={contractModalCancle}
    onCancel={contractModalCancle}
  />
);

export default ContractProposalModal;

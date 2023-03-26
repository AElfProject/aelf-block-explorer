import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
} from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";
import { CHAIN_ID } from "../../../../constants";
import CopylistItem from "../CopylistItem";
import "./index.less";
interface IStatus {
  // 0: success 1: fail 2: loading 3: un-arrival
  verification: number;
  execution: number;
}
interface IModalProps {
  isUpdate: boolean;
  transactionId: string;
  message: string;
  status: IStatus;
  cancel: Function;
}
interface IProps {
  open: boolean;
  withoutApprovalProps: IModalProps;
}

const noticeContent = [
  "Transaction pre-verification failure, will not deduct the cost;",
  "If the deployment fails, the deducted expenses will not be refunded;",
  "The contract deployment is divided into two phases, which take about 1-10 minutes.",
  "You can close this page during deployment. This page does not affect the process of contract deployment.",
];
const getMessage = (props) => {
  const { isUpdate, status, message, transactionId, title } = props;
  const { verification, execution } = status || {};
  // verification loading
  if (verification === 2) {
    return (
      <div className="verification-loading">
        {`Contract ${isUpdate ? "update" : "deployment"} verification...`}
      </div>
    );
  } else if (verification === 1) {
    return (
      <div className="verification-fail">
        <div className="title">
          <CloseCircleFilled className="circle-icon close" />
          <span className={`fail-message`}>
            {`${title || "Transaction pre-verification failed！"}`}
          </span>
        </div>
        <div className={`content ${!!title && "text-left"}`}>{message}</div>
        <CopylistItem
          label="Transaction ID"
          value={transactionId}
          href={""}
          valueHref={`${window.location.origin}/tx/${transactionId}`}
        ></CopylistItem>
      </div>
    );
  }
  if (verification === 0) {
    if (execution === 2) {
      return (
        <div className="execution-loading">
          {`Contract ${isUpdate ? "update" : "deployment"}  in progress...`}
        </div>
      );
    } else if (execution === 0) {
      return (
        <div className="execution-success">
          <div className="title">
            <CheckCircleFilled className="circle-icon check" />
            <span className={`success-message`}>{`The contract is ${
              isUpdate ? "updated" : "deployed"
            }!`}</span>
          </div>
          <div className="content">{message}</div>
          <CopylistItem
            label="Transaction ID"
            value={transactionId}
            href={""}
          ></CopylistItem>
        </div>
      );
    } else if (execution === 1) {
      return (
        <div className="execution-fail">
          <div className="title">
            <CloseCircleFilled className="circle-icon close" />
            <span className={`fail-message`}>
              {`Contract ${isUpdate ? "update" : "deployment"}  failure！`}
            </span>
          </div>
          <div className="content">{message}</div>
          <CopylistItem
            label="Transaction ID"
            value={transactionId}
            href={""}
          ></CopylistItem>
        </div>
      );
    }
  }
};
const WithoutApprovalModal = (props: IProps) => {
  const { open, withoutApprovalProps } = props;
  const { isUpdate, cancel, status } = withoutApprovalProps;
  const handleCancel = () => {
    cancel();
  };
  return (
    <Modal
      width={800}
      open={open}
      onOk={handleCancel}
      okText="Close"
      closable={false}
      wrapClassName="without-approval-modal"
    >
      <div className="without-approval-modal-degree">
        <div className="deployment-verification">
          {status?.verification === 0 && (
            <CheckCircleOutlined className="circle-icon check" />
          )}
          {status?.verification === 1 && (
            <CloseCircleOutlined className="circle-icon close" />
          )}
          {(status?.verification === 2 || status?.verification === 3) && (
            <span className={`icon icon${status?.verification}`}>1</span>
          )}
          <span className={`title title${status?.verification}`}>
            {`${isUpdate ? "Update" : "Deployment"}  verification`}
          </span>
        </div>
        <div className="middle-line"></div>
        <div className="deployment-execution">
          {status?.execution === 0 && (
            <CheckCircleOutlined className="circle-icon check" />
          )}
          {status?.execution === 1 && (
            <CloseCircleOutlined className="circle-icon close" />
          )}
          {(status?.execution === 2 || status?.execution === 3) && (
            <span className={`icon icon${status?.execution}`}>2</span>
          )}
          <span className={`title title${status?.execution}`}>
            {`${isUpdate ? "Update" : "Deployment"}  execution`}
          </span>
        </div>
      </div>
      <div className="without-approval-modal-message">
        {getMessage(withoutApprovalProps)}
      </div>
      <div className="without-approval-modal-notice">
        <div className="title">Notice</div>
        <div className="content">
          {(CHAIN_ID === "AELF" ? noticeContent : noticeContent.slice(1)).map(
            (ele, index) => {
              return (
                <div className="content-item">
                  <span>{index + 1}.</span>
                  <span>{ele}</span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </Modal>
  );
};

export default WithoutApprovalModal;

import { Modal } from "antd";
import React from "react";
import { isPhoneCheck } from "../../utils/deviceCheck";
import "./index.less";

interface IOnlyOkModal {
  message: string;
}
export const onlyOkModal = ({ message }: IOnlyOkModal) => {
  const isMobile = isPhoneCheck();
  Modal.confirm({
    className: `only-ok-modal ${isMobile ? "only-ok-modal-mobile" : ""}`,
    width: "680",
    title: <div style={{ textAlign: "left" }}>{message}</div>,
    icon: null,
    cancelButtonProps: { style: { display: "none" } },
    transitionName: "ant-fade",
  });
};

export const showAccountInfoSyncingModal = () => {
  onlyOkModal({
    message: "Synchronizing on-chain account information...",
  });
};

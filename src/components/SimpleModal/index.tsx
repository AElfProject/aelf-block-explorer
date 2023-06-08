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
    className: `only-ok-modal${isMobile ? "-mobile" : ""}`,
    width: "720",
    title: <div style={{ textAlign: "left" }}>{message}</div>,
    icon: null,
    cancelButtonProps: { style: { display: "none" } },
  });
};

export const showAccountInfoSyncingModal = () => {
  onlyOkModal({
    message: "Synchronizing on-chain account information..."
  })
}

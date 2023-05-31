import { Modal } from "antd";
import React from "react";
import "./index.less";

interface IOnlyOkModal {
  message: string;
}
export const onlyOkModal = ({ message }: IOnlyOkModal) => {
  Modal.confirm({
    className: "only-ok-modal",
    width: "720",
    title: <div style={{ textAlign: "left" }}>{message}</div>,
    icon: null,
    cancelButtonProps: { style: { display: "none" } },
  });
};

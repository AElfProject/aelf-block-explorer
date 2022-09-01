import React from "react";
import copy from "copy-to-clipboard";
import { message } from "antd";
import IconFont from "../IconFont";

export default function CopyButton({ value }) {
  const handleCopy = () => {
    try {
      copy(value);
      message.success("Copied!");
    } catch (e) {
      message.error("Copy failed, please copy by yourself.");
    }
  };
  return (
    <IconFont
      className="copy-btn"
      style={{ fontSize: 16 }}
      type="copy"
      onClick={handleCopy}
    />
  );
}

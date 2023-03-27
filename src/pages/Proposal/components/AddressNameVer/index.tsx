import { Button, message } from "antd";
import React from "react";
import copy from "copy-to-clipboard";
import { omitString } from "../../../../common/utils";
import IconFont from "../../../../components/IconFont";
import addressFormat from "../../../../utils/addressFormat";
import "./index.less";
export const AddressNameVer = ({ address, name, ver }) => {
  const handleCopy = () => {
    try {
      copy(address);
      // eslint-disable-next-line no-undef
      message.success("Copied!");
    } catch (e) {
      message.error("Copy failed, please copy by yourself.");
    }
  };
  return (
    <div className="address-name-ver">
      <div className="contract-address">
        <span className="label">Contract Address:</span>
        <span className="content">
          <a href={`/address/${addressFormat(address)}`}>
            {omitString(address, 10, 10)}
          </a>
          <Button
            onClick={handleCopy}
            icon={<IconFont type="copy" />}
            title="Copy code"
            className="copy-btn"
          ></Button>
        </span>
      </div>
      <div className="contract-name">
        <span className="label">Contract Name:</span>
        <span className="content">{name}</span>
      </div>
      <div className="contract-version">
        <span className="label">Version:</span>
        <span className="content">{ver}</span>
      </div>
    </div>
  );
};

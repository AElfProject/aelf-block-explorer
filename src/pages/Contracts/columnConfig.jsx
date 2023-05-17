// eslint-disable-next-line no-use-before-define
import React from "react";
import { Tag, Tooltip } from "antd";
import clsx from "clsx";
import moment from "moment";
import { Link } from "react-router-dom";
import { validateVersion } from "../../utils/regExps";
import addressFormat, { hiddenAddress } from "../../utils/addressFormat";
import CopyButton from "../../components/CopyButton/CopyButton";

export default ({ isMobile }) => {
  return [
    {
      title: "Address",
      dataIndex: "address",
      width: isMobile ? 232 : 320,
      ellipsis: true,
      render: (text) => (
        <div className="address">
          <Tooltip title={addressFormat(text)}>
            <Link
              to={`/address/${addressFormat(text)}#contracts`}
              title={addressFormat(text)}
            >
              {addressFormat(hiddenAddress(text))}
            </Link>
          </Tooltip>
          <CopyButton value={addressFormat(text)} />
        </div>
      ),
    },
    {
      title: "Contract Name",
      dataIndex: "contractName",
      ellipsis: true,
      width: isMobile ? 126 : 220,
      render(name) {
        return name === "-1" ? "-" : name;
      },
    },
    {
      title: "Type",
      dataIndex: "isSystemContract",
      width: isMobile ? 110 : 230,
      render(isSystem) {
        return (
          <Tag className={clsx(isSystem ? "system" : "user")}>
            {isSystem ? "System" : "User"}
          </Tag>
        );
      },
    },
    {
      title: "Version",
      dataIndex: "version",
      width: isMobile ? 66 : 142,
      render(version) {
        return validateVersion(version) ? version : "-";
      },
    },
    {
      title: "Last Updated At",
      width: isMobile ? 166 : 160,
      align: "right",
      dataIndex: "updateTime",
      render(time) {
        return moment(time).format("yyyy-MM-DD HH:mm:ss");
      },
    },
  ];
};

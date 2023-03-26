// eslint-disable-next-line no-use-before-define
import React from "react";
import PropTypes from "prop-types";
import { Button, message } from "antd";
import copy from "copy-to-clipboard";
import { Link } from "react-router-dom";
import IconFont from "../../../../components/IconFont";
import { omitString } from "../../../../common/utils";
import "./index.less";

const CopylistItem = (props) => {
  const {
    label,
    value = "",
    href,
    isParentHref = false,
    valueHref = "",
  } = props;
  const handleCopy = () => {
    try {
      copy(value);
      // eslint-disable-next-line no-undef
      message.success("Copied!");
    } catch (e) {
      message.error("Copy failed, please copy by yourself.");
    }
  };
  return !value ? (
    <div>
      <span>{label}</span>
    </div>
  ) : (
    <div className="copy-list-item-wrapper">
      <span className="copy-list-label">{label}:</span>
      <span className="copy-list-value">
        {valueHref && <a href={valueHref}>{omitString(value, 10, 10)}</a>}
        {href ? (
          <>
            {isParentHref ? (
              <Button
                type="circle"
                onClick={() => {
                  window.parent.location.replace(href);
                }}
              >
                <IconFont type="shareLink" />
              </Button>
            ) : (
              <Button type="circle">
                <Link to={href}>
                  <IconFont type="shareLink" />
                </Link>
              </Button>
            )}
          </>
        ) : null}

        <Button
          onClick={handleCopy}
          type="circle"
          icon={<IconFont type="copy" />}
          title="Copy code"
        />
      </span>
    </div>
  );
};

CopylistItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  isParentHref: PropTypes.bool,
  valueHref: PropTypes.string,
};
CopylistItem.defaultProps = {
  isParentHref: false,
  valueHref: "",
};
export default CopylistItem;

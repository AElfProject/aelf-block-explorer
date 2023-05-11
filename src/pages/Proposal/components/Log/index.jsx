/**
 * @file log in/out
 * @author atom-yang
 */
import React from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { If, Then, Else } from "react-if";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import { logOut, logIn } from "@redux/actions/proposalCommon";
import { LOG_STATUS } from "@redux/common/constants";
import { isPhoneCheck } from "../../../../common/utils";

const OverLay = (props) => {
  const { address } = props;
  const dispatch = useDispatch();

  function handleLogout() {
    localStorage.removeItem("currentWallet");
    dispatch(logOut(address));
  }
  return (
    <Menu onClick={handleLogout}>
      <Menu.Item key='1'>Logout</Menu.Item>
    </Menu>
  );
};
OverLay.propTypes = {
  address: PropTypes.string.isRequired,
};

const LogButton = (props) => {
  const { isExist } = props;
  const common = useSelector((state) => state.common);
  const { loading, logStatus, currentWallet } = common;
  const { name, address = "" } = currentWallet;
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(logIn());
  };

  return (
    <>
      <If condition={!!isExist}>
        <Then>
          <If condition={logStatus === LOG_STATUS.LOGGED}>
            <Then>
              {isPhoneCheck() ? (
                <Button>{name}</Button>
              ) : (
                <Dropdown
                  overlay={<OverLay loading={loading} address={address} />}
                >
                  <Button>
                    {name} <DownOutlined />
                  </Button>
                </Dropdown>
              )}
            </Then>
            <Else>
              <Button type='primary' loading={loading} onClick={handleLogin}>
                Login
              </Button>
            </Else>
          </If>
        </Then>
      </If>
    </>
  );
};

LogButton.propTypes = {
  isExist: PropTypes.bool.isRequired,
};

export default LogButton;

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
import { WebLoginState, useWebLogin } from "aelf-web-login";
import { isPhoneCheck } from "../../../../common/utils";

const OverLay = (props) => {
  const { address } = props;
  const dispatch = useDispatch();
  const { loginState, login, logout } = useWebLogin();

  return (
    <Menu onClick={logout}>
      <Menu.Item key='1'>Logout</Menu.Item>
    </Menu>
  );
};
OverLay.propTypes = {
  address: PropTypes.string.isRequired,
};

const LogButton = (props) => {
  const common = useSelector((state) => state.common);
  const { loading, currentWallet } = common;
  const { name, address = "" } = currentWallet;
  const dispatch = useDispatch();
  const { loginState, login } = useWebLogin();

  return (
    <>
      <If condition={loginState === WebLoginState.logined}>
        <Then>
          {isPhoneCheck() ? (
            <Button>{name}</Button>
          ) : (
            <Dropdown
              overlay={<OverLay loading={loading} address={address} />}
            >
              <Button type="primary" className="proposals-login-btn">
                {name} 
                <DownOutlined />
              </Button>
            </Dropdown>
          )}
        </Then>
        <Else>
          <Button type='primary' loading={loading} onClick={login}>
            Login
          </Button>
        </Else>
      </If>
    </>
  );
};

LogButton.propTypes = {
  isExist: PropTypes.bool.isRequired,
};

export default LogButton;

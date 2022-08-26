/**
 * @file App container
 * @author atom-yang
 */
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import useUseLocation from "react-use/lib/useLocation";
import { useSelector, useDispatch } from "react-redux";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Tabs, Popover } from "antd";
import { logIn, LOG_IN_ACTIONS } from "./actions/common";
import LogButton from "./components/Log";
import { LOG_STATUS } from "./common/constants";
import walletInstance from "./common/wallet";
import Plugin from "../../components/plugin";
import Rules from "./components/Rules";
import { isPhoneCheck, sendMessage } from "../../common/utils";

const { TabPane } = Tabs;

const ROUTES_UNDER_TABS = {
  proposals: ["proposals", "proposalDetails"],
  organizations: ["organizations", "createOrganizations"],
  apply: ["apply"],
  myProposals: ["myProposals"],
};

function useRouteMatch(path) {
  const pathKey = path.split("/")[2];
  const [result] = Object.values(ROUTES_UNDER_TABS).find((tab) =>
    tab.find((item) => item === pathKey)
  ) || ["proposals"];
  return result;
}

export const RouterComponent = (options) => {
  const logStatus = useSelector((state) => state.common.logStatus);
  const isLogged = useMemo(() => logStatus === LOG_STATUS.LOGGED, [logStatus]);
  const target = useMemo(
    () =>
      isLogged ? options.target : <Navigate to={options.default} replace />,
    [isLogged]
  );
  return target;
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logStatus = useSelector((state) => state.common.logStatus);
  const [isExist, setIsExist] = useState(true);
  const location = useLocation();
  const { pathname } = location;
  const tabKey = useRouteMatch(pathname);
  const { href } = useUseLocation();

  const isLogged = useMemo(() => logStatus === LOG_STATUS.LOGGED, [logStatus]);

  useEffect(() => {
    sendMessage({
      href,
    });
  }, [href]);

  useEffect(() => {
    walletInstance.isExist
      .then((result) => {
        const wallet = JSON.parse(localStorage.getItem("currentWallet"));
        const timeDiff = wallet
          ? new Date().valueOf() - Number(wallet.timestamp)
          : 15 * 60 * 1000;

        setIsExist(result);
        if (!result) {
          dispatch({
            type: LOG_IN_ACTIONS.LOG_IN_FAILED,
            payload: {},
          });
        } else if (
          typeof walletInstance.proxy.elfInstance.getExtensionInfo ===
          "function"
        ) {
          walletInstance.getExtensionInfo().then((info) => {
            if (!info.locked) {
              dispatch(logIn());
            } else {
              localStorage.removeItem("currentWallet");
              dispatch({
                type: LOG_IN_ACTIONS.LOG_IN_FAILED,
                payload: {},
              });
            }
          });
        } else if (timeDiff < 15 * 60 * 1000) {
          dispatch(logIn());
        } else {
          localStorage.removeItem("currentWallet");
          dispatch({
            type: LOG_IN_ACTIONS.LOG_IN_FAILED,
            payload: {},
          });
        }
      })
      .catch(() => {
        setIsExist(false);
      });
  }, []);
  const handleTabChange = (key) => {
    navigate(`/proposal/${key}`);
  };
  return (
    <div className='proposal'>
      {isExist ? null : <Plugin />}
      <Tabs
        defaultActiveKey={tabKey}
        activeKey={tabKey}
        onChange={handleTabChange}
        tabBarExtraContent={
          <>
            <Popover content={<Rules />} placement='bottom'>
              <span className='gap-right-small'>
                <ExclamationCircleOutlined
                  className={
                    isPhoneCheck() ? "main-color" : "gap-right-small main-color"
                  }
                />
                {isPhoneCheck() ? " Rule" : "Proposal Rules"}
              </span>
            </Popover>
            <LogButton isExist={!!isExist} />
          </>
        }
      >
        <TabPane tab='Proposals' key='proposals' />
        {isLogged && <TabPane tab='Apply' key='apply' />}
        <TabPane tab='Organizations' key='organizations' />
        {isLogged && <TabPane tab='My Proposals' key='myProposals' />}
      </Tabs>
      <div className='proposal-container'>
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default App;

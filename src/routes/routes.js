/**
 * @file
 * @author huangzongzhe
 * TODO: details modified to Resource
 */
import React, { lazy, useEffect } from "react";
import { Navigate, useNavigate, useRoutes } from "react-router";
import { useLocation } from "react-use";
import unfetch from "unfetch";
import { ProposalRouter } from "../pages/Proposal/routes";
import { WebLoginInstance } from "../utils/webLogin";

// Notice: we need register the route in Breadcurmb.js.
// If not, we will always turn to '/'
const HomePage = lazy(() => import("../pages/Home/Home"));
const BlocksPage = lazy(() => import("../pages/Blocks/BlockList"));
const BlockDetailPage = lazy(() => import("../pages/BlockDetail/BlockDetail"));
const TxsPage = lazy(() => import("../pages/Txs/TransactionList"));
const TxsDetailPage = lazy(() =>
  import("../pages/TxsDetail/TransactionDetail")
);
const VotePage = lazy(() => import("../pages/Vote/Vote"));
const Resource = lazy(() => import("../pages/Resource/Resource"));
const ResourceDetail = lazy(() =>
  import("../pages/ResourceDetail/ResourceDetail")
);
const Accounts = lazy(() => import("../pages/Accounts/Accounts"));
const Contracts = lazy(() => import("../pages/Contracts/Contracts"));
const AddressDetail = lazy(() =>
  import("../pages/AddressDetail/AddressDetail")
);
const Tokens = lazy(() => import("../pages/Tokens/Tokens"));
const TokenInfo = lazy(() => import("../pages/Token/Token"));
const SearchFailed = lazy(() => import("../pages/SearchFailed/SearchFailed"));
const SearchInvalid = lazy(() =>
  import("../pages/SearchInvalid/SearchInvalid")
);
const GOVERNANCE_LIST = ["/proposal", "/vote", "/resource"];
// eslint-disable-next-line import/prefer-default-export
export const PageRouter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    // if the history entry was not pushed/replaced by app-router, it will reload in Next.js
    const onRouteChange = () => {
      const isGovernance = GOVERNANCE_LIST.some((ele) =>
        window.location.pathname.startsWith(ele)
      );
      if (isGovernance) {
        window.microApp.dispatch({
          pathname: window.location.pathname + window.location.hash,
        });
      }
    };
    const onDataListener = (data) => {
      // if (data.path && data.path !== pathname) {
      // navigate(data.path);
      // }
      if (data.type === "logoutSilently") {
        WebLoginInstance.get().logoutAsync({
          noModal: true
        });
      }
    };
    if (window.microApp) {
      window.fetch = unfetch;
      window.microApp.addDataListener(onDataListener, true);
      window.addEventListener("hashchange", onRouteChange);
      window.addEventListener("pushstate", onRouteChange);
      // window.addEventListener("popstate", onDataListener);
    }
    return () => {
      window.microApp.removeDataListener(onDataListener);
      window.removeEventListener("hashchange", onRouteChange);
      window.removeEventListener("pushstate", onRouteChange);
      // window.removeEventListener("pophstate", onDataListener);
    };
  }, []);
  const MICRO_APP_ROUTER = ProposalRouter.concat([
    {
      path: "/vote",
      element: <Navigate to="/vote/election" replace />,
    },
    { path: "/vote/*", element: <VotePage /> },
    { path: "/resource", element: <Resource /> },
    { path: "/resourceDetail/:id", element: <ResourceDetail /> },
  ]);
  return useRoutes(
    window.microApp
      ? MICRO_APP_ROUTER
      : MICRO_APP_ROUTER.concat([
          { path: "/", element: <HomePage /> },
          { path: "/blocks", element: <BlocksPage /> },
          // { path: "/unconfirmedBlocks", element: <BlocksPage /> },
          { path: "/block/:id", element: <BlockDetailPage /> },
          { path: "/txs", element: <TxsPage /> },
          // { path: "/unconfirmedTxs", element: <TxsPage /> },
          { path: "/txs/block", element: <TxsPage /> },
          { path: "/tx/:id", element: <TxsDetailPage /> },
          { path: "/token", element: <Tokens /> },
          { path: "/token/:symbol", element: <TokenInfo /> },
          { path: "/search-invalid/:string", element: <SearchInvalid /> },
          { path: "/search-invalid/*", element: <SearchInvalid /> },
          { path: "/search-failed", element: <SearchFailed /> },
          { path: "/accounts", element: <Accounts /> },
          // { path: "/contract", element: <Accounts /> },
          { path: "/address/:address", element: <AddressDetail /> },
          { path: "/contract/:address", element: <AddressDetail /> },
          { path: "/address/:address/:codeHash", element: <AddressDetail /> },
          { path: "/contracts", element: <Contracts /> },
          { path: "*", element: <Navigate to="/" replace /> },
        ])
  );
};

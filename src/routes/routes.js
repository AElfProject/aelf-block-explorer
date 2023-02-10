/**
 * @file
 * @author huangzongzhe
 * TODO: details modified to Resource
 */
import React, { lazy } from "react";
import { Navigate, useRoutes } from "react-router";

import { ProposalRouter } from "../pages/Proposal/routes";

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

// eslint-disable-next-line import/prefer-default-export
export const PageRouter = () =>
  useRoutes(
    ProposalRouter.concat([
      { path: "/", element: <HomePage /> },
      { path: "/blocks", element: <BlocksPage /> },
      // { path: "/unconfirmedBlocks", element: <BlocksPage /> },
      { path: "/block/:id", element: <BlockDetailPage /> },
      { path: "/txs", element: <TxsPage /> },
      // { path: "/unconfirmedTxs", element: <TxsPage /> },
      { path: "/txs/block", element: <TxsPage /> },
      { path: "/tx/:id", element: <TxsDetailPage /> },
      { path: "/vote", element: <Navigate to="/vote/election" /> },
      { path: "/vote/*", element: <VotePage /> },
      { path: "/resource", element: <Resource /> },
      { path: "/resourceDetail/:id", element: <ResourceDetail /> },
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
      { path: "*", element: <Navigate to="/" /> },
    ])
  );

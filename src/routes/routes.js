/**
 * @file
 * @author huangzongzhe
 * TODO: details modified to Resource
 */
import React, { lazy } from "react";
import { Navigate, useRoutes } from "react-router";

import { AddressRouter } from "../pages/Address/routes";
import { ProposalRouter } from "../pages/Proposal/routes";

// Notice: we need register the route in Breadcurmb.js.
// If not, we will always turn to '/'
const HomePage = lazy(() => import("../pages/Home/Home"));
const BlocksPage = lazy(() => import("../pages/Blocks/BlockList"));
const BlockDetailPage = lazy(() => import("../pages/BlockDetail/BlockDetail"));
const TxsPage = lazy(() => import("../pages/Txs/TransactionList"));
const TxsDetailPage = lazy(() => import("../pages/TxsDetail/TransactionDetail"));
const VotePage = lazy(() => import("../pages/Vote/Vote"));
const Resource = lazy(() => import("../pages/Resource/Resource"));
const ResourceDetail = lazy(() =>
  import("../pages/ResourceDetail/ResourceDetail")
);
const Token = lazy(() => import("../pages/Token"));
const SearchFailed = lazy(() => import("../pages/SearchFailed/SearchFailed"));
const SearchInvalid = lazy(() => import("../pages/SearchInvalid/SearchInvalid"));

// eslint-disable-next-line import/prefer-default-export
export const PageRouter = () =>
  useRoutes(
    AddressRouter.concat(ProposalRouter, [
      { path: "/", element: <HomePage /> },
      { path: "/blocks", element: <BlocksPage /> },
      { path: "/unconfirmedBlocks", element: <BlocksPage /> },
      { path: "/block/:id", element: <BlockDetailPage /> },
      { path: "/txs", element: <TxsPage /> },
      { path: "/unconfirmedTxs", element: <TxsPage /> },
      { path: "/txs/block", element: <TxsPage /> },
      { path: "/tx/:id", element: <TxsDetailPage /> },
      { path: "/vote", element: <Navigate to='/vote/election' /> },
      { path: "/vote/*", element: <VotePage /> },
      { path: "/resource", element: <Resource /> },
      { path: "/resourceDetail/:id", element: <ResourceDetail /> },
      { path: "/token", element: <Token /> },
      { path: "/search-invalid/:string", element: <SearchInvalid /> },
      { path: "/search-invalid/*", element: <SearchInvalid /> },
      { path: "/search-failed", element: <SearchFailed /> },
      { path: "*", element: <Navigate to='/' /> },
    ])
  );

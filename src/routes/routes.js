/**
 * @file
 * @author huangzongzhe
 * TODO: details modified to Resource
 */
import { lazy } from "react";
import { Navigate, useRoutes } from "react-router";
const HomePage = lazy(() => import("../pages/Home/Home"));
const BlocksPage = lazy(() => import("../pages/Blocks/Blocks"));
const BlockDetailPage = lazy(() => import("../pages/BlockDetail/BlockDetail"));
const TxsPage = lazy(() => import("../pages/Txs/Txs"));
const TxsDetailPage = lazy(() => import("../pages/TxsDetail/TxsDetail"));
const VotePage = lazy(() => import("../pages/Vote/Vote"));
const Resource = lazy(() => import("../pages/Resource/Resource"));
const ResourceDetail = lazy(() =>
  import("../pages/ResourceDetail/ResourceDetail")
);
const Token = lazy(() => import("../pages/Token"));

import { AddressRouter } from "../pages/Address/routes";
import { ProposalRouter } from "../pages/Proposal/routes";

// Notice: we need register the route in Breadcurmb.js.
// If not, we will always turn to '/'

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
      { path: "*", element: <Navigate to='/' /> },
    ])
  );

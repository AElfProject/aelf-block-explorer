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
const AddressPage = lazy(() => import("../pages/Address/Address"));
const TxsPage = lazy(() => import("../pages/Txs/Txs"));
const TxsDetailPage = lazy(() => import("../pages/TxsDetail/TxsDetail"));
const VotePage = lazy(() => import("../pages/Vote/Vote"));
const Resource = lazy(() => import("../pages/Resource/Resource"));
const ResourceDetail = lazy(() =>
  import("../pages/ResourceDetail/ResourceDetail")
);
const Viewer = lazy(() => import("../pages/Viewer"));
const Token = lazy(() => import("../pages/Token"));
const Proposal = lazy(() => import("../pages/Proposal"));

// Notice: we need register the route in Breadcurmb.js.
// If not, we will always turn to '/'

export const PageRouter = () =>
  useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/blocks", element: <BlocksPage /> },
    { path: "/unconfirmedBlocks", element: <BlocksPage /> },
    { path: "/block/:id", element: <BlockDetailPage /> },
    { path: "/address", element: <AddressPage /> },
    { path: "/address/:id", element: <AddressPage /> },
    { path: "/txs", element: <TxsPage /> },
    { path: "/unconfirmedTxs", element: <TxsPage /> },
    { path: "/txs/block", element: <TxsPage /> },
    { path: "/tx/:id", element: <TxsDetailPage /> },
    { path: "/vote", element: <Navigate to='/vote/election' /> },
    { path: "/vote/*", element: <VotePage /> },
    { path: "/resource", element: <Resource /> },
    { path: "/resourceDetail/:id", element: <ResourceDetail /> },
    { path: "/contract", element: <Viewer /> },
    { path: "/token", element: <Token /> },
    { path: "/proposal", element: <Proposal /> },
    { path: "*", element: <Navigate to='/' /> },
  ]);

import { lazy } from "react";
const ContractInfo = lazy(() => import("./containers/ContractInfo"));
const ContractList = lazy(() => import("./containers/ContractList"));
const AccountList = lazy(() => import("./containers/AccountList"));
const AccountInfo = lazy(() => import("./containers/AccountInfo"));
const TokenList = lazy(() => import("./containers/TokenList"));
const TokenInfo = lazy(() => import("./containers/TokenInfo"));
export const AddressRouter = [
  {
    path: "/address",
    element: <AccountList />,
  },
  {
    path: "/address/:address",
    element: <AccountInfo />,
  },
  {
    // We cannot use ? in v6
    path: "/address/:address/:symbol",
    element: <AccountInfo />,
  },
  { path: "/contract", element: <ContractList /> },
  { path: "/contract/:address", element: <ContractInfo /> },
  { path: "/contract/:address/:codeHash", element: <ContractInfo /> },
  { path: "/token", element: <TokenList /> },
  { path: "/token/:symbol", element: <TokenInfo /> },
];

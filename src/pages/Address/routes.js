/* eslint-disable import/prefer-default-export */
import React, { lazy } from "react";

const TokenList = lazy(() => import("./containers/TokenList"));
const TokenInfo = lazy(() => import("./containers/TokenInfo"));
export const AddressRouter = [
  { path: "/token", element: <TokenList /> },
  { path: "/token/:symbol", element: <TokenInfo /> },
];

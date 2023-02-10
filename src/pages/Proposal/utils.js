import { getCsrfToken, getSignParams, getTxResult } from "./common/utils";
import { request } from "../../common/request";
import { API_PATH } from "./common/constants";

import { deserializeLog } from "../../common/utils";

export async function updateContractName(wallet, currentWallet, params) {
  const signedParams = await getSignParams(wallet, currentWallet);
  if (Object.keys(signedParams).length > 0) {
    return request(
      API_PATH.UPDATE_CONTRACT_NAME,
      {
        ...params,
        ...signedParams,
      },
      {
        headers: {
          "x-csrf-token": getCsrfToken(),
        },
      }
    );
  }
  throw new Error("get signature failed");
}

export async function addContractName(wallet, currentWallet, params) {
  const signedParams = await getSignParams(wallet, currentWallet);
  if (Object.keys(signedParams).length > 0) {
    return request(
      API_PATH.ADD_CONTRACT_NAME,
      {
        ...params,
        ...signedParams,
      },
      {
        headers: {
          "x-csrf-token": getCsrfToken(),
        },
      }
    );
  }
  throw new Error("get signature failed");
}

export async function getDeserializeLog(aelf, txId, logName) {
  if (!txId)
    throw new Error("Transaction failed. Please reinitiate this step.");
  const txResult = await getTxResult(aelf, txId ?? "");
  if (txResult.Status === "MINED") {
    const { Logs = [] } = txResult;
    const log = (Logs || []).filter((v) => v.Name === logName);
    if (log.length === 0) {
      return;
    }
    const result = await deserializeLog(log[0], log[0].Name, log[0].Address);
    // eslint-disable-next-line consistent-return
    return result;
  }
}

export function getContractURL(address) {
  // eslint-disable-next-line max-len
  return `${window.location.protocol}//${window.location.host}/contract/${address}#contract`;
}

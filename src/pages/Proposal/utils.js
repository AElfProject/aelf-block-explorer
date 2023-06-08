import { getCsrfToken, getTxResult } from "../../redux/common/utils";
import { request } from "../../common/request";
import { API_PATH } from "../../redux/common/constants";

import { deserializeLog } from "../../common/utils";
import { WebLoginInstance } from "../../utils/webLogin";
import { APPNAME } from "../../../config/config";

async function sign(currentWallet, hexToBeSign) {
  const { getSignature } = WebLoginInstance.get().getWebLoginContext();
  const { signature } = await getSignature({
    appName: APPNAME,
    address: currentWallet.address,
    hexToBeSign,
  });
  return signature;
}
export async function updateContractName(currentWallet, params) {
  const timestamp = new Date().getTime();
  const signature = await sign(currentWallet, timestamp);
  const signedParams = {
    address: currentWallet.address,
    signature,
    pubKey: currentWallet.publicKey,
    timestamp,
  };
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

export async function addContractName(currentWallet, params) {
  const timestamp = new Date().getTime();
  const signature = await sign(currentWallet, timestamp);
  const signedParams = {
    address: currentWallet.address,
    signature,
    pubKey: currentWallet.publicKey,
    timestamp,
  };
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
  const txRes = await getTxResult(aelf, txId ?? "");
  let txResult = txRes;
  if (txRes?.data) {
    txResult = txRes.data;
  }
  // A transaction is said to be mined when it is included to the blockchain in a new block.
  if (txResult.Status === "MINED") {
    const { Logs = [] } = txResult;
    let log;
    if (Array.isArray(logName)) {
      log = (Logs || []).filter((v) => logName.includes(v.Name));
    } else {
      log = (Logs || []).filter((v) => v.Name === logName);
    }
    if (log.length === 0) {
      return;
    }
    const result = await deserializeLog(log[0], log[0].Name, log[0].Address);
    // eslint-disable-next-line consistent-return
    return result;
  }
}

export const getTransactionResult = async (aelf, txId) => {
  if (!txId) {
    throw new Error("Transaction failed. Please reinitiate this step.");
  }
  const txResult = await getTxResult(aelf, txId ?? "");
  return txResult;
};

export function getContractURL(address) {
  // eslint-disable-next-line max-len
  return `${window.location.protocol}//${window.location.host}/contract/${address}#contract`;
}

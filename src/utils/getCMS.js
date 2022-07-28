// enum NETWORK_TYPE: MAIN | TEST
import { NETWORK_TYPE } from "../../config/config";
import axios from "axios";

export const sleep = (time) => {
  return new Promise((resolve) => {
    const ids = setTimeout(() => {
      clearTimeout(ids);
      resolve("sleep");
    }, time);
  });
};

// get cms data
export async function getCMSDelayRequest(delay = 5000) {
  try {
    await sleep(delay);
    const res = await axios({
      method: "get",
      url: "/cms/chain-list-by-networks",
      params: {
        // populate: "chain",
        // "filters[netWorkType][$eq]": NETWORK_TYPE,
        netWorkType: NETWORK_TYPE,
      },
    });
    if (res.data && res.data.length) {
      return res.data[0] || {};
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
}

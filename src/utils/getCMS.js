// enum NETWORK_TYPE: MAIN | TEST
import { NETWORK_TYPE } from "../../config/config";
import axios from "axios";

export const sleep = (time) => {
  return new Promise((resolve) => {
    const ids = setTimeout(() => {
      clearTimeout(ids);
      resolve('sleep');
    }, time);
  });
};

// get cms data
export async function getCMSDelayRequest(delay = 5000) {
  try {
    await sleep(delay);
    const res = await axios({
      method: "get",
      url: "/cms/api/chain-states",
      params: {
        populate: "chain",
        "filters[netWorkType][$eq]": NETWORK_TYPE,
      },
    });
    if (res.data && res.data.data.length) {
      return res.data.data[0].attributes;
    } else {
      return {};
    }
  } catch (error) {
    throw error;
  }
}

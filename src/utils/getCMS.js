// enum NETWORK_TYPE: MAIN | TEST
import axios from 'axios';
import { NETWORK_TYPE } from 'constants/config/config';

export const sleep = (time) =>
  new Promise((resolve) => {
    const ids = setTimeout(() => {
      clearTimeout(ids);
      resolve('sleep');
    }, time);
  });

// get cms data in server side
export async function getCMSDelayRequestSSR(ctx, delay = 5000) {
  await sleep(delay);
  const host = process.env.BUILD_ENDPOINT || ctx.req?.headers.host;
  const res = await axios({
    method: 'get',
    url: `${host}/cms/chain-list-by-networks`,
    params: {
      netWorkType: NETWORK_TYPE,
    },
  });
  if (res.data && res.data.length) {
    return res.data[0] || {};
  }
  return {};
}

// get cms data
export async function getCMSDelayRequest(delay = 5000) {
  await sleep(delay);
  const res = await axios({
    method: 'get',
    url: '/cms/chain-list-by-networks',
    params: {
      netWorkType: NETWORK_TYPE,
    },
  });
  if (res.data && res.data.length) {
    return res.data[0] || {};
  }
  return {};
}

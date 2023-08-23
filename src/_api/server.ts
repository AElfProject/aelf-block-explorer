/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 00:20:45
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-04 14:49:17
 * @Description: server
 */

export type RequestWithParams = {
  params?: any;
} & RequestInit;

const DEFAULT_FETCH_TIMEOUT = 5000;
const myServer = new Function();
const timeoutPromise = (delay: number) => {
  return new Promise<{ type: string }>((resolve) => {
    setTimeout(() => {
      resolve({ type: 'timeout' });
    }, delay);
  });
};

async function service(url: string, options: RequestWithParams) {
  const { params = {} } = options;
  const paramsArr: Array<any> = [];
  if (Object.keys(params).length > 0) {
    for (const item in params) {
      paramsArr.push(item + '=' + params[item]);
    }
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArr.join('&');
    } else {
      url += '&' + paramsArr.join('&');
    }
  }

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
    } else {
      console.log(response.status);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

myServer.prototype.parseRouter = function (name: string, urlObj: any) {
  const obj: any = (this[name] = {});
  Object.keys(urlObj).forEach((key) => {
    obj[key] = this.send.bind(this, urlObj[key]);
  });
};

myServer.prototype.send = async function (url: string, options: RequestWithParams) {
  const rs = await Promise.race([service(url, options), timeoutPromise(DEFAULT_FETCH_TIMEOUT)]);
  if (rs?.type === 'timeout') {
    // console.error('timeout');
    throw new Error('fetch timeout');
  }
  return rs;
};

export default myServer.prototype;

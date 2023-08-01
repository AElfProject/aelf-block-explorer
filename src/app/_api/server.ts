/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 00:20:45
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 01:09:16
 * @Description: server
 */

async function service(url: string, options?: RequestInit) {
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
const myServer = new Function();

myServer.prototype.parseRouter = function (name: string, urlObj: any) {
  const obj: any = (this[name] = {});
  Object.keys(urlObj).forEach((key) => {
    obj[key] = this.send.bind(this, urlObj[key]);
  });
};

myServer.prototype.send = async function (url: string, options?: RequestInit) {
  return await service(url, options);
};

export default myServer.prototype;

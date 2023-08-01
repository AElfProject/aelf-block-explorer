/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 18:14:03
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 00:28:09
 * @Description: fetch
 */
import { REQUEST_API_TYPE, API_List } from './list';
import myServer from './server';

Object.entries(API_List).forEach(([key, value]) => {
  myServer.parseRouter(key, value);
});

const request: REQUEST_API_TYPE = Object.assign({}, myServer.send, myServer);
export default request;

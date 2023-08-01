/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:38:58
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 01:15:25
 * @Description: TopAccounts List
 */

import request from 'app/_api';

export default async function TopAccounts() {
  const { products } = await request.block.getBlockList();
  return (
    <>
      <ul>
        {products.map((ele) => {
          return <li key={ele.description}>{ele.description}</li>;
        })}
      </ul>
    </>
  );
}

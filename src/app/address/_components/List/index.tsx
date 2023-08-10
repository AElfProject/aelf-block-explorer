/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 10:50:50
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-10 15:15:41
 * @Description: address list component
 */

import request from '@_api';

async function fetchData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const { products } = await request.block.getBlockList({ cache: 'no-store' });
  return products;
}

export default async function List() {
  const products = await fetchData();
  return (
    <ul className="user-list">
      {products.map((ele) => {
        return <li key={ele.description}>{ele.description}</li>;
      })}
    </ul>
  );
}

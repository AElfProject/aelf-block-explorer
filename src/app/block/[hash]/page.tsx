/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:01:05
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:09:42
 * @Description: Block
 */

export default function Block({ params }: { params: HashParams }) {
  return <div>Block details, my hash is {params.hash}</div>;
}

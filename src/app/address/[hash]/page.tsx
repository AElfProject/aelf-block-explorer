/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:39:54
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:11:12
 * @Description: TopAccount or Contract
 */
export default function TopAccount({ params }: { params: HashParams }) {
  return <div>TopAccount or Contracts, my hash is {params.hash}</div>;
}

/*
 * @Author: abigail.deng
 * @Date: 2023-07-31 16:04:07
 * @LastEditors: abigail.deng
 * @LastEditTime: 2023-08-01 17:13:27
 * @Description: Tokens
 */
export default function Tokens({ params }: { params: ChainId }) {
  return <div>Tokens, my chainId is {params.chain}</div>;
}

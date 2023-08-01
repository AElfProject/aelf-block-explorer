/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:16:23
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:12:23
 * @Description: NFTs
 */
export default function Nfts({ params }: { params: ChainId }) {
  return <div>Nfts, my chainId is {params.chain}</div>;
}

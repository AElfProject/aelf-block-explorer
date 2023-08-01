/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:13:52
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:13:09
 * @Description: TokenSysbol
 */
export default function TokenSysbol({ params }: { params: ChainId & TokenSymbol }) {
  return (
    <div>
      Tokens, my chainId is {params.chain}, my tokenSysbol is {params.tokenSymbol}
    </div>
  );
}

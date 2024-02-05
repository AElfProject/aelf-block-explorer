/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:13:52
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:13:09
 * @Description: TokenSysbol
 */
import Detail from './detail';

export default function TokenSymbol({ params }: { params: ChainId & TokenSymbol }) {
  return (
    <div>
      <Detail />
    </div>
  );
}

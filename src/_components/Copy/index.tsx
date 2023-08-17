/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 17:59:06
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 00:01:54
 * @Description: Copy
 */
import IconFont from '@_components/IconFont';
import copy from 'copy-to-clipboard';
import { message } from 'antd';
export default function Copy({ value }: { value: string }) {
  const handleCopy = () => {
    try {
      copy(value);
      message.success('Copied Successfully');
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };
  return <IconFont className=" text-xs copy-btn w-3 h-3 ml-1" type="Copy" onClick={handleCopy} />;
}

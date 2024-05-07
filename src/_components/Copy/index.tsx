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
import clsx from 'clsx';
export default function Copy({ value, className }: { value: string; className?: string }) {
  const handleCopy = () => {
    try {
      copy(value);
      message.success('Copied Successfully');
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };
  return <IconFont className={clsx(className, 'copy-btn ml-1 size-3 text-sm')} type="Copy" onClick={handleCopy} />;
}

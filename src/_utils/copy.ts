import { message } from 'antd';
import copy from 'copy-to-clipboard';
export function handelCopy(value) {
  try {
    copy(value);
    message.success('Copied Successfully');
  } catch (e) {
    message.error('Copy failed, please copy by yourself.');
  }
}

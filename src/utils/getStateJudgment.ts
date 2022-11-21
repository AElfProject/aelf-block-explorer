/**
 * @file stateMachine
 * @author zhouminghui
 */

import { message } from 'antd';

export default function getStateJudgment(status, hash) {
  switch ((status || '').toUpperCase()) {
    case 'NOTEXISTED':
      message.error(
        'The transaction is no existed. Please make sure you have enough balance or query the transaction ID',
        10,
      );
      message.error(`Transaction ID: ${hash}`, 10);
      break;
    case 'PENDING':
      message.info('The transaction is in progress. Please query the transaction ID', 10);
      message.info(`Transaction ID: ${hash}`, 10);
      break;
    case 'MINED':
      message.success('Successful operation', 3);
      message.success(`Transaction ID: ${hash}`, 6);
      break;
    case 'FAILED':
      message.error('Operation failed', 3);
      break;
    case 'UNEXECUTABLE':
      message.error('Unexecutable Operation', 3);
      break;
  }
}

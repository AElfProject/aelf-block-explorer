/**
 * @file stateMachine
 * @author zhouminghui
 */

import { Message } from 'antd';

export default function getStateJudgment(status, hash) {
  switch ((status || '').toUpperCase()) {
    case 'NOTEXISTED':
      Message.error(
        'The transaction is no existed. Please make sure you have enough balance or query the transaction ID',
        10,
      );
      Message.error(`Transaction ID: ${hash}`, 10);
      break;
    case 'PENDING':
      Message.info(
        'The transaction is in progress. Please query the transaction ID',
        10,
      );
      Message.info(`Transaction ID: ${hash}`, 10);
      break;
    case 'MINED':
      Message.success('Successful operation', 3);
      Message.success(`Transaction ID: ${hash}`, 6);
      break;
    case 'FAILED':
      Message.error('Operation failed', 3);
      break;
    case 'UNEXECUTABLE':
      Message.error('Unexecutable Operation', 3);
      break;
  }
}

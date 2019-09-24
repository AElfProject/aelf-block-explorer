/**
 * @file stateMachine
 * @author zhouminghui
 */

import {Message} from 'antd';

export default function getStateJudgment(status, hash) {
    switch (status) {
        case 'NotExisted':
            Message.error('The transaction is no existed. Please query the transaction ID', 10);
            Message.error('Transaction ID: ' + hash, 10);
            break;
        case 'Pending':
            Message.info('The transaction is in progress. Please query the transaction ID', 10);
            Message.info('Transaction ID: ' + hash, 10);
            break;
        case 'Mined' :
            Message.success('Successful operation', 3);
            break;
        case 'Failed' :
            Message.error('Operation failed', 3);
            break;
    }
}
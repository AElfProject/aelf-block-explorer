/**
 * @file stateMachine
 * @author zhouminghui
 */

import {Message} from 'antd';

export default function getStateJudgment(status, hash) {
    switch (status) {
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
/**
 * @file stateMachine
 * @author zhouminghui
 */

import {Message} from 'antd';

export default function getStateJudgment(status) {
    switch (status) {
        case 'Pending':
            Message.info('Operation in progress... , Please check the results later', 1);
            break;
        case 'Mined' :
            Message.success('Successful operation', 1);
            break;
        case 'Failed' :
            Message.error('Operation failed', 1);
            break;
    }
}
/**
 * @file setNewPermission.js
 * @author zhouminghui
*/
import { CHAIN_ID } from '@src/constants';
import {message} from 'antd';
import contracts from "./contracts";
export default function setNewPermission(nightElf, payload) {
    const {
        appName,
        address
    } = payload;
    nightElf.setContractPermission({
        appName,
        chainId: CHAIN_ID,
        payload: {
            address,
            contracts
        }
    }, (error, result) => {
        if (result && result.error === 0) {
            message.success('Update Permission success!!', 3);
        }
        else {
            message.error(result.errorMessage.message, 3);
        }
    });
}


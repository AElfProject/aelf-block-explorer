/**
 * @file utils.js
 * @author huangzongzhe, longyue
 */
import {
    notification
} from 'antd';
import {
    create
} from 'apisauce';
import * as AElf from 'aelf-sdk';
import dayjs from 'dayjs';
import {
    RPCSERVER
} from './constants';


// import apisauce from './utils/apisauce';

const api = create({
    baseURL: '/api'
});

const httpErrorHandler = (message, des) => notification.open({
    message,
    description: des
});
const timeout = null;
const user = null;
const password = null;
const header = [{
    name: 'Accept',
    value: 'text/plain;v=1.0'
}]
const aelf = new AElf(new AElf.providers.HttpProvider(
    RPCSERVER //,
    // timeout,
    // user,
    // password,
    // header
));

const get = async (url, params, config) => {
    const res = await api.get(url, params, config);
    if (res.ok) {
        return res.data;
    }

    httpErrorHandler(res.problem, res.problem);
};

const post = async (url, data, config) => {
    const res = await api.post(url, data, config);
    if (res.ok) {
        return res.data;
    }

    httpErrorHandler(res.problem, res.problem);
};

const format = (time, fmtStr = "YYYY-MM-DD HH:mm:ss Z") => dayjs(time).format(fmtStr);

const firstUpperCase = (inputString) => {
    return inputString.replace(inputString[0] ,inputString[0].toUpperCase());
};

/**
 * the style of the key of the result from the API are different
 * like: block_hash, tx_info, ExecutionState, SignatureState
 * format: block_hash -> BlockHash
 * @Param {string} inputString key
 * return {string}
 */
const formatKey = (inputString) => {
    const pieces = inputString.split('_');
    const piecesFormatted = pieces.map(item => {
        return firstUpperCase(item);
    });
    return piecesFormatted.join('');
};

function transactionFormat(result) {
    let newTxs = {
        address_from: result.Transaction.From,
        address_to: result.Transaction.To,
        block_hash: result.BlockHash,
        block_height: result.BlockNumber,
        increment_id: result.Transaction.IncrementId || '',
        method: result.Transaction.MethodName,
        params: result.Transaction.Params,
        tx_id: result.TransactionId,
        tx_status: result.Status
    };
    return newTxs;
}

const transactionInfo = (hash) => {
    return aelf.chain.getTxResult(hash, {sync: true});
}

export {
    get,
    post,
    aelf,
    format,
    formatKey,
    transactionFormat,
    transactionInfo
};

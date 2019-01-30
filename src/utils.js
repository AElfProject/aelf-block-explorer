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
import * as Aelf from 'aelf-sdk';
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

const aelf = new Aelf(new Aelf.providers.HttpProvider(RPCSERVER));

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
        address_from: result.tx_info.From,
        address_to: result.tx_info.To,
        block_hash: result.block_hash,
        block_height: result.block_number,
        increment_id: result.tx_info.IncrementId,
        method: result.tx_info.Method,
        params: result.tx_info.params,
        tx_id: result.tx_info.TxId,
        tx_status: result.tx_status
    };
    return newTxs;
}

const transactionInfo = (hash) => {
    return aelf.chain.getTxResult(hash);
}

export {
    get,
    post,
    aelf,
    format,
    formatKey,
    transactionFormat,
    transactionInfo
}
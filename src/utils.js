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

const api = create({
    baseURL: '/api'
});

const httpErrorHandler = (message, des) => notification.open({
    message,
    description: des
});

const aelf = new Aelf(new Aelf.providers.HttpProvider(RPCSERVER));

aelf.chain.connectChain(function (e) {
    // if (isEmpty(e.message)) {
    //     return;
    // }
    // httpErrorHandler('Connect Error', e.message);
    // console.error(e.message);
});


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

/*
 * the style of the key of the result from the API are different
 * like: block_hash, tx_info, ExecutionState, SignatureState
 * format: block_hash -> BlockHash
 */
const formatKey = (inputString) => {
    const pieces = inputString.split('_');
    const piecesFormatted = pieces.map(item => {
        return firstUpperCase(item);
    });
    return piecesFormatted.join('');
};

export {
    get,
    post,
    aelf,
    format,
    formatKey
};
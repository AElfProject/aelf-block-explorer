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

import {MINERSPRIVATEKEY} from '../config/config';

// import apisauce from './utils/apisauce';

const api = create({
    baseURL: '/api'
});

const httpErrorHandler = (message, des) => notification.open({
    message,
    description: des
});

const aelf = new Aelf(new Aelf.providers.HttpProvider(RPCSERVER));
const allAddress = Object.values(aelf.chain.connectChain().result);
// console.log(aelf.chain.connectChain().result, allAddress);
const TOKENADDRESS = allAddress[3];
const CONSENSUSADDRESS = allAddress[4];
const DIVIDENDSADDRESS = allAddress[5];



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

const getVoting = (value) => {
    console.log('投票' + value);
}

const getRedeem = (value) => {
    console.log('赎回' + value);
}

const hexCharCodeToStr = (hexCharCodeStr) => {
    　　var trimedStr = hexCharCodeStr.trim();
    　　var rawStr = 
    　　trimedStr.substr(0,2).toLowerCase() === "0x"
    　　? 
    　　trimedStr.substr(2) 
    　　: 
    　　trimedStr;
    　　var len = rawStr.length;
    　　if(len % 2 !== 0) {
    　　　　alert("Illegal Format ASCII Code!");
    　　　　return "";
    　　}
    　　var curCharCode;
    　　var resultStr = [];
    　　for(var i = 0; i < len;i = i + 2) {
    　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    　　　　resultStr.push(String.fromCharCode(curCharCode));
    　　}
    　　return resultStr.join("");
    }

const transactionInfo = (hash) => {
    return aelf.chain.getTxResult(hash);
}
// minesrs 可以留着 让用户在没有绑定钱包的时候可以看到链上的信息
const wallet = Aelf.wallet.getWalletByPrivateKey(MINERSPRIVATEKEY);
// console.log(wallet);
// 投票合约
const consensus = aelf.chain.contractAt(CONSENSUSADDRESS, wallet);
// 分红合约
const dividends = aelf.chain.contractAt(DIVIDENDSADDRESS, wallet);
// token合约
const tokenContract = aelf.chain.contractAt(TOKENADDRESS, wallet);

export {
    get,
    post,
    aelf,
    format,
    formatKey,
    transactionFormat,
    formatNumber,
    getVoting,
    getRedeem,
    consensus,
    dividends,
    tokenContract,
    CONSENSUSADDRESS,
    DIVIDENDSADDRESS,
    TOKENADDRESS,
    transactionInfo
}
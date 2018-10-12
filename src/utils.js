import {
    notification
} from 'antd';
import {
    create
} from 'apisauce';
import * as Aelf from 'aelf-sdk';
import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';
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
}

const format = (time, fmtStr = "YYYY-MM-DD HH:MM:ss Z") => dayjs(time).format(fmtStr);

export {
    get,
    post,
    aelf,
    format
};
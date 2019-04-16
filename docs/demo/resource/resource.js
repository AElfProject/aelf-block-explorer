/**
 * @file resource.js
 * @author zmh3788
 * @description 可以快速上手的demo
*/

import getEstimatedValueELF from '../../../src/utils/getEstimatedValueELF';

const appName = 'resource demo';
const httpProvider = 'http://192.168.197.56:8101/chain';
const header = [{
    name: 'Accept',
    value: 'text/plain;v=1.0'
}];

const multiToken = '4rkKQpsRFt1nU6weAHuJ6CfQDqo6dxruU3K3wNUFr6ZwZYc';
const tokenConverter = '4QjhKLWacRXrQYpT7rzf74k5XZFCx8yF3X7FXbzKD4wwEo6';
const feeReceiver = '4CBbRKd6rkCzTX5aJ2mnGrwJiHLmGdJZinoaVfMvScTEoBR';
const ELF = document.getElementById('Elf');
const RAM = document.getElementById('RAM');



document.addEventListener('NightElf', result => {
    console.log(result);
    // As a rule, we need to confirm the link of the chain first.
    const aelf = new window.NightElf.AElf({
        // Enter your test address in this location
        httpProvider,
        // If you want to use WebApi, add header
        // header,
        appName
    });

    aelf.login({
        appName,
        chainId: 'AELF',
        payload: {
            method: 'LOGIN',
            contracts: [{
                chainId: 'AELF',
                contractAddress: multiToken,
                contractName: 'multiToken',
                description: 'multiToken contract',
                github: ''
            },
            {
                chainId: 'AELF',
                contractAddress: tokenConverter,
                contractName: 'tokenConverter',
                description: 'tokenConverter contract',
                github: ''
            }]
        }
    }, (error, result) => {
        console.log('login>>>>>>>>>>>>>>>>>>', result);
        window.address = JSON.parse(result.detail).address;
    });

    aelf.chain.getChainInformation((error, result) => {
        console.log('>>>>>>>>>>>>> getChainInformation >>>>>>>>>>>>>');
        console.log(error, result);
        if (result) {
            setTimeout(() => {
                contractAtAsync();
            });
        }
    });



    const getChainInformation = document.getElementById('getChainInformation');
    getChainInformation.onclick = function () {
        aelf.chain.getChainInformation((error, result) => {
            console.log('>>>>>>>>>>>>> getChainInformation >>>>>>>>>>>>>');
            console.log(error, result);
            if (result) {
                setTimeout(() => {
                    contractAtAsync();
                });
            }
        });
    };

    function contractAtAsync() {
        aelf.chain.contractAtAsync(
            multiToken,
            {address: window.address},
            (error, result) => {
                console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
                console.log(error, result);
                window.tokenContract = result;
                if (result) {
                    getBalance();
                }
            }
        );

        aelf.chain.contractAtAsync(
            tokenConverter,
            {address: window.address},
            (error, result) => {
                console.log('>>>>>>>>>>>>> contractAtAsync >>>>>>>>>>>>>');
                console.log(error, result);
                window.tokenConverter = result;
            }
        );
    }

    // get your balance
    function getBalance() {
        const payload = {
            symbol: 'ELF',
            owner: window.address
        };

        const payload2 = {
            symbol: 'RAM',
            owner: window.address
        };

        window.tokenContract.GetBalance.call(payload, (error, result) => {
            if (result) {
                ELF.innerHTML = result.balance;
            }
        });

        window.tokenContract.GetBalance.call(payload2, (error, result) => {
            if (result) {
                RAM.innerHTML = result.balance;
            }
        });
    }

    const buyInput = document.getElementById('buy');
    const buyShow = document.getElementById('buytoken');
    buyInput.onchange = function (e) {
        const buyNum = parseInt(e.target.value, 10);
        window.resourceBuy = buyNum;
        getEstimatedValueELF('RAM', buyNum, window.tokenConverter, window.tokenContract).then(result => {
            window.buyNum = Math.floor(result);
            buyShow.innerHTML = window.buyNum + 'Elf';
            console.log('buyNum', window.buyNum);
        });
    };

    const sellInput = document.getElementById('sell');
    const sellShow = document.getElementById('selltoken');
    sellInput.onchange = function (e) {
        const sellNum = parseInt(e.target.value, 10);
        window.resourceSell = sellNum;
        getEstimatedValueELF('RAM', sellNum, window.tokenConverter, window.tokenContract).then(result => {
            window.sellNum = Math.floor(result);
            sellShow.innerHTML = window.sellNum + 'Elf';
            console.log('sellNum', window.sellNum);
        });
    };

    const txId = document.getElementById('txId');
    const buyButton = document.getElementById('buy-resource');
    buyButton.onclick = function () {
        let params = {
            symbol: 'ELF',
            spender: feeReceiver,
            amount: window.buyNum + (window.buyNum * 0.1)
        };
        // Approve it has nothing to do with business.
        window.tokenContract.Approve(params, (error, result) => {
            if (result) {
                params.spender = tokenConverter;
                window.tokenContract.Approve(params, (error, result) => {
                    if (result) {
                        getBuy();
                    }
                });
            }
        });
    };
    const sellButton = document.getElementById('sell-resource');
    sellButton.onclick = function () {
        let params = {
            symbol: 'RAM',
            spender: feeReceiver,
            amount: window.resourceSell
        };
        // Approve it has nothing to do with business.
        window.tokenContract.Approve(params, (error, result) => {
            if (result) {
                params.spender = tokenConverter;
                window.tokenContract.Approve(params, (error, result) => {
                    if (result) {
                        getSell();
                    }
                });
            }
        });
    };

    function getBuy() {
        const params = {
            symbol: 'RAM',
            amount: window.resourceBuy
        };
        window.tokenConverter.Buy(params, (error, result) => {
            if (result && result.error === 0) {
                txId.innerHTML = result.TransactionId || result.result.TransactionId;
                setTimeout(() => {
                    getBalance();
                }, 4000);
            }
        });
    }

    function getSell() {
        const params = {
            symbol: 'RAM',
            amount: window.resourceSell
        };
        window.tokenConverter.Sell(params, (error, result) => {
            if (result && result.error === 0) {
                txId.innerHTML = result.TransactionId || result.result.TransactionId;
                setTimeout(() => {
                    getBalance();
                }, 4000);
            }
        });
    }
});


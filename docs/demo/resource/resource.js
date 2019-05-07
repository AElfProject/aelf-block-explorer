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

const multiToken = '2J9wWhuyz7Drkmtu9DTegM9rLmamjekmRkCAWz5YYPjm7akfbH';
const tokenConverter = 'Acv7j84Ghi19JesSBQ8d56XenwCrJ5VBPvrS4mthtbuBjYtXR';
const feeReceiver = '25CecrU94dmMdbhC3LWMKxtoaL4Wv8PChGvVJM6PxkHAyvXEhB';
const ELF = document.getElementById('Elf');
const RAM = document.getElementById('RAM');



document.addEventListener('NightElf', result => {
    // As a rule, we need to confirm the link of the chain first.
    const aelf = new window.NightElf.AElf({
        // Enter your test address in this location
        httpProvider: [
            httpProvider,
            null,
            null,
            null,
            header
        ],
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

    aelf.chain.getChainStatus((error, result) => {
        console.log('>>>>>>>>>>>>> getChainStatus >>>>>>>>>>>>>');
        console.log(error, result);
        if (result) {
            setTimeout(() => {
                contractAtAsync();
            });
        }
    });



    const getChainStatus = document.getElementById('getChainStatus');
    getChainStatus.onclick = function () {
        aelf.chain.getChainStatus((error, result) => {
            console.log('>>>>>>>>>>>>> getChainStatus >>>>>>>>>>>>>');
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


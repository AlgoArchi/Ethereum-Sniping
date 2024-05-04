const { Web3 } = require('web3');
const fs = require('fs');
const { ethers } = require('ethers');

const abiJsonFile = './abi.json';
const abi = JSON.parse(fs.readFileSync(abiJsonFile)).abi;

const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/5MPFX7Jqd09DT8kb_RVVsE6jWxDUPd4R");
const uniswapFactoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

const uniswapFactoryContract = new ethers.Contract(
    uniswapFactoryAddress,
    abi,
    provider
);


const pairCreateFilter = uniswapFactoryContract.filters.PairCreated();

const initializeProvider = async () => {
    try{
        await provider.ready;
    
        uniswapFactoryContract.on(pairCreateFilter, async (event) => {
            console.log("Listening Pair Create Event Event");
            console.log('event.args', event.args);
            const token0 = event.args[0];
            const token1 = event.args[1];
            const pair = event.args[2];
            console.log("Token 0", token0.toString(), "Token 1", token1.toString(), "Pair ", pair.toString());
        });
    } catch(error) {
        console.log("event listening error", error);
    }
};

initializeProvider();

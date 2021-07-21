const dotenv = require("dotenv");
dotenv.config();

const { argv } = require('process');
const { Contract, getDefaultProvider, Wallet } = require('ethers');
const { Provider } = require('@ethersproject/providers');
const abi = require('./vesting.json');

const provider = getDefaultProvider(process.env.PROVIDER);
const acc = new Wallet(process.env.INDIVIDUAL_PK, provider);
const owner = new Wallet(process.env.OWNER_PK, provider);
const contractAsIndi = new Contract(process.env.CONTRACT_ADDR, abi, acc);
const contractAsOwner = new Contract(process.env.CONTRACT_ADDR, abi, owner);

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
    retries = 3;
    while (retries > 0) {
        try {
            await contractAsIndi.releaseMyTokens();

            await contractAsOwner.releaseBeneficiaryTokens();
            
            retries = 0;
        } catch (e) {
            console.error(e);
            retries--;
            console.log(retries);
            delay(2000);
        }
    }
    console.log("done");
}

run();

// setInterval(run, process.env.DURATUION);
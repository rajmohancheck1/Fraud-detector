const Web3 = require('web3');
const contractABI = require('./FraudDetection.abi');
const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const web3 = new Web3('https://mainnet.infura.io/v3/4d850f48a22d45089a821f4fb2f8ddae');
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function addTransaction(user, amount, flagged) {
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addTransaction(user, amount, flagged).send({ from: accounts[0] });
}

module.exports = { addTransaction };
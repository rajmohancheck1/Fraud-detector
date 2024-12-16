const Web3 = require('web3');

// Use the local Ganache instance (adjust the URL if needed)
const web3 = new Web3('http://localhost:8545'); // URL for Ganache

// ABI and contract address (replace with actual deployed contract address)
const contractABI = require('./FraudDetection.json');
const contractAddress = '0x45A55d0ED671fD284Ba63725DfbC1ff7Fa1aCbda'; // Replace with actual address

// Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Add a new transaction to the blockchain
async function addTransaction(user, amount, isValid) {
    try {
        const accounts = await web3.eth.getAccounts();
        
        if (accounts.length === 0) {
            throw new Error('No accounts found');
        }

        const receipt = await contract.methods
            .addTransaction(user, amount, isValid) // Call the addTransaction method in the smart contract
            .send({ from: accounts[0], gas: 1500000, gasPrice: await web3.eth.getGasPrice() });
        
        console.log('Transaction added to blockchain:', receipt);
    } catch (error) {
        console.error('Error adding transaction to blockchain:', error);
        throw error; // Propagate error for further handling

    }
}

// Get all transactions from the blockchain
async function getAllTransactions() {
    try {
        const transactions = await contract.methods.getTransactions().call(); // Get all transactions from the smart contract
        return transactions; // Return the list of transactions
    } catch (error) {
        console.error('Error fetching transactions from blockchain:', error);
        throw error; // Propagate error for further handling
    }
}

async function getTransactionsByBlockNumber(blockNumber) {
    try {
        // Fetch the block details using the block number
        const block = await web3.eth.getBlock(blockNumber, true); // 'true' includes transaction data
        
        if (!block || !block.transactions) {
            throw new Error(`No transactions found for block number ${blockNumber}`);
        }

        return block.transactions; // Return the list of transactions in the block
    } catch (error) {
        console.error('Error fetching transactions by block number:', error);
        throw error; // Propagate error for further handling
    }
}

module.exports = { addTransaction, getAllTransactions,getTransactionsByBlockNumber };

const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const contractABI = require('./FraudDetection.json').abi;
const contractBytecode = require('./FraudDetection.json').bytecode;

// Use environment variables or secure key management
const privateKey = process.env.PRIVATE_KEY || "9a5b22c6fb53dd643d09c3791d2782e6a2db3cc97329a4c161558e2476408449";
const infuraUrl = `https://eth-mainnet.alchemyapi.io/v2/${process.env.INFURA_PROJECT_ID || 'XboeS8oCh-ZgfbfRMYaQFt_Q1NRWHkPX'}`;

const provider = new HDWalletProvider(
  privateKey,
  infuraUrl
);

const web3 = new Web3(provider);

async function deployContract() {
    try {
        const accounts = await web3.eth.getAccounts();
        
        // Ensure you have an account
        if (accounts.length === 0) {
            throw new Error('No accounts found');
        }

        const contract = new web3.eth.Contract(contractABI);
  
        const deployedContract = await contract
            .deploy({ 
                data: contractBytecode,
                arguments: [] // Add constructor arguments if any
            })
            .send({ 
                from: accounts[0], 
                gas: 1500000,
                gasPrice: await web3.eth.getGasPrice()
            });
      
        console.log('Contract deployed at:', deployedContract.options.address);
        return deployedContract;
    } catch (err) {
        console.error('Deployment error:', err);
        throw err; // Re-throw to allow caller to handle
    } finally {
        // Always close the provider to prevent hanging
        provider.engine.stop();
    }
}
  
module.exports = { deployContract };
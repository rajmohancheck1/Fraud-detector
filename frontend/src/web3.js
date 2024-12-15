import Web3 from 'web3';
const web3 = new Web3('https://mainnet.infura.io/v3/4d850f48a22d45089a821f4fb2f8ddae');
const abi = []; // Replace with your contract ABI
const address = 'YOUR_CONTRACT_ADDRESS';
export default new web3.eth.Contract(abi, address);
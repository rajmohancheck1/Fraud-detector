import Web3 from 'web3';
import contractABI from '../../backend/blockchain/FraudDetection.json';

const web3 = new Web3(window.ethereum);
const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'; // Your deployed contract address

const fraudDetectionContract = new web3.eth.Contract(
  contractABI.abi, 
  contractAddress
);

export { web3, fraudDetectionContract };
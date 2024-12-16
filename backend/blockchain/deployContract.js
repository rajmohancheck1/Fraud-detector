// const { ethers } = require("ethers");
// const fs = require("fs");

// async function deployContract() {
//     try {
//         const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/${process.env.INFURA_PROJECT_ID || 'XboeS8oCh-ZgfbfRMYaQFt_Q1NRWHkPX'}`);
//         const wallet = new ethers.Wallet("9a5b22c6fb53dd643d09c3791d2782e6a2db3cc97329a4c161558e2476408449", provider);

//         const abi = fs.readFileSync("./FraudDetection.abi", "utf8");
//         const bytecode = fs.readFileSync("./FraudDetection.bin", "utf8");

//         const factory = new ethers.ContractFactory(abi, bytecode, wallet);
//         const contract = await factory.deploy();
//         console.log("Contract deployed at:", contract.address);
//     } catch (err) {
//         console.error('Error:', err);
//     }
// }

// deployContract();

const { ethers } = require("ethers");
const fs = require("fs");

async function deployContract() {
    const provider = new ethers.providers.JsonRpcProvider("INFURA_OR_ALCHEMY_URL");
    const wallet = new ethers.Wallet("PRIVATE_KEY", provider);

    const abi = fs.readFileSync("./FraudDetection.abi", "utf8");
    const bytecode = fs.readFileSync("./FraudDetection.bin", "utf8");

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy();
    console.log("Contract deployed at:", contract.address);
}

deployContract();

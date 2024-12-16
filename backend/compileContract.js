const fs = require('fs');
const solc = require('solc');

// Read and compile the Solidity contract
const input = {
    language: 'Solidity',
    sources: {
        'FraudDetection.sol': {
            content: fs.readFileSync('./blockchain/contracts/FraudDetection.sol', 'utf8'),
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode'],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const abi = output.contracts['FraudDetection.sol'].FraudDetection.abi;
const bytecode = output.contracts['FraudDetection.sol'].FraudDetection.evm.bytecode.object;

// Write ABI and bytecode to files
fs.writeFileSync('./blockchain/contracts/FraudDetection.abi', JSON.stringify(abi));
fs.writeFileSync('./blockchain/contracts/FraudDetection.bin', bytecode);

console.log('ABI and Bytecode generated successfully!');

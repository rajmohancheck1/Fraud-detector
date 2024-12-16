pragma solidity ^0.8.0;

contract FraudDetection {
    struct Transaction {
        uint id;
        address user;
        uint amount;
        bool flagged;
    }

    Transaction[] public transactions;
    address public admin;
    uint private transactionCounter;

    event FraudDetected(uint id, address user, uint amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        transactionCounter = 0;
    }

    // Add a transaction to the blockchain
    function addTransaction(address user, uint amount, bool flagged) public onlyAdmin {
        transactions.push(Transaction(transactionCounter, user, amount, flagged));
        if (flagged) {
            emit FraudDetected(transactionCounter, user, amount);
        }
        transactionCounter++;  // Increment the transaction ID
    }

    // Get all transactions
    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    // Get a specific transaction by ID
    function getTransactionById(uint id) public view returns (Transaction memory) {
        require(id < transactionCounter, "Transaction ID does not exist");
        return transactions[id];
    }
}

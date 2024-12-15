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

    event FraudDetected(uint id, address user, uint amount);

    constructor() {
        admin = msg.sender;
    }

    function addTransaction(address user, uint amount, bool flagged) public {
        require(msg.sender == admin, "Only admin can add transactions");
        transactions.push(Transaction(transactions.length, user, amount, flagged));
        if (flagged) {
            emit FraudDetected(transactions.length, user, amount);
        }
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }
}
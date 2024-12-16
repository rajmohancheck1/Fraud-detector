// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FraudDetection {
    struct Transaction {
        uint id;                       // Transaction ID
        address user;                  // User's address
        uint amount;                   // Transaction amount
        bool flagged;                  // Fraud flag
        uint senderOldBalance;         // Sender's balance before the transaction
        uint senderNewBalance;         // Sender's balance after the transaction
        uint receiverOldBalance;       // Receiver's balance before the transaction
        uint receiverNewBalance;       // Receiver's balance after the transaction
    }

    Transaction[] public transactions; // Array to store all transactions
    address public admin;              // Address of the admin
    uint private transactionCounter;   // Counter for unique transaction IDs

    // Event to notify when fraud is detected
    event FraudDetected(
        uint id,
        address user,
        uint amount,
        uint senderOldBalance,
        uint senderNewBalance,
        uint receiverOldBalance,
        uint receiverNewBalance
    );

    // Modifier to restrict certain functions to the admin only
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    // Constructor to set the deployer as the admin
    constructor() {
        admin = msg.sender;
        transactionCounter = 0;
    }

    // Add a transaction to the blockchain
    function addTransaction(
        address user,
        uint amount,
        bool flagged,
        uint senderOldBalance,
        uint senderNewBalance,
        uint receiverOldBalance,
        uint receiverNewBalance
    ) public onlyAdmin {
        // Create and store the transaction
        transactions.push(
            Transaction({
                id: transactionCounter,
                user: user,
                amount: amount,
                flagged: flagged,
                senderOldBalance: senderOldBalance,
                senderNewBalance: senderNewBalance,
                receiverOldBalance: receiverOldBalance,
                receiverNewBalance: receiverNewBalance
            })
        );

        // Emit the fraud detection event if flagged
        if (flagged) {
            emit FraudDetected(
                transactionCounter,
                user,
                amount,
                senderOldBalance,
                senderNewBalance,
                receiverOldBalance,
                receiverNewBalance
            );
        }

        // Increment the transaction counter
        transactionCounter++;
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

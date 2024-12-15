const express = require('express');
const router = express.Router();
const Transaction = require('./models/Transaction');
const blockchain = require('./blockchain/interactBlockchain');

router.post('/transactions', async (req, res) => {
    const { user, amount } = req.body;
    const flagged = false; // Use AI prediction
    const transaction = new Transaction({ user, amount, flagged });
    await transaction.save();
    await blockchain.addTransaction(user, amount, flagged);
    res.status(200).json(transaction);
});

module.exports = router;
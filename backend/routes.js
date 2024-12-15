const express = require('express');
const router = express.Router();
const Transaction = require('./models/Transaction');
const blockchain = require('./blockchain/interactBlockchain');
router.post('/transactions', async (req, res) => {
    try {
        const { user, amount } = req.body;
        const flagged = false; // Use AI prediction
        const transaction = new Transaction({ user, amount, flagged });
        await transaction.save();
        await blockchain.addTransaction(user, amount, flagged);
        res.status(200).json(transaction);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'An error occurred while processing the transaction' });
    }
});

module.exports = router;

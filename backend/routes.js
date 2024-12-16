const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('./models/Transaction');
const BlockchainService = require('./blockchain/interactBlockchain');

// Fraud prediction endpoint
router.post('/predict-fraud', async (req, res) => {
    try {
        // Forward request to AI model API (replace with your actual model endpoint)
        const aiResponse = await axios.post('http://localhost:5000/predict', req.body);
        
        res.json(aiResponse.data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Fraud prediction failed', 
            details: error.message 
        });
    }
});

// Transaction submission endpoint
router.post('/transactions', async (req, res) => {
    try {
        const { 
            user, 
            amount, 
            cardNumber, 
            transactionType, 
            location 
        } = req.body;

        // Call fraud prediction (uncomment and use your AI model for fraud detection)
        // const fraudPrediction = await axios.post('/predict-fraud', {
        //     amount,
        //     transaction_hour: new Date().getHours(),
        //     is_international: location !== 'local',
        //     merchant_category: transactionType
        // });

        // Create transaction record
        const transaction = new Transaction({
            user,
            amount,
            cardNumber,
            transactionType,
            location,
            // fraudProbability: fraudPrediction.data.fraud_probability,
            // flagged: fraudPrediction.data.is_fraudulent
        });

        // Save to database
        await transaction.save();

        // Log to blockchain if suspicious (assuming flagged value is true for demo purposes)
        // In a real case, the fraud flag should be determined by AI model
        if (true) { // Replace this with the actual fraud flag when it's available
            await BlockchainService.addTransaction(
                user, 
                amount, 
                true // Assuming the transaction is flagged as suspicious for this demo
            );
        }

        res.status(200).json({
            transaction // The transaction data returned from the database
        });

    } catch (error) {
        res.status(500).json({ 
            error: 'Transaction processing failed', 
            details: error.message 
        });
    }
});

// Get transaction history
router.get('/transactions', async (req, res) => {
    try {
        const { user, flagged } = req.query;
        
        let query = {};
        if (user) query.user = user;
        if (flagged !== undefined) query.flagged = flagged === 'true';

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 }) // Sort by date in descending order
            .limit(50); // Limit to 50 transactions

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ 
            error: 'Could not retrieve transactions', 
            details: error.message 
        });
    }
});

// Get all blockchain transactions (optional endpoint to check blockchain state)
router.get('/blockchain-transactions', async (req, res) => {
    try {
        const blockchainTransactions = await BlockchainService.getAllTransactions();
        res.status(200).json(blockchainTransactions);
    } catch (error) {
        res.status(500).json({ 
            error: 'Could not retrieve blockchain transactions', 
            details: error.message 
        });
    }
});


module.exports = router;

// backend/routes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Transaction = require('./models/Transaction');
const BlockchainService = require('./blockchain/interactBlockchain');

// Fraud prediction endpoint
router.post('/predict-fraud', async (req, res) => {
    try {
        // Forward request to AI model API
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

        // Call fraud prediction
        const fraudPrediction = await axios.post('/predict-fraud', {
            amount,
            transaction_hour: new Date().getHours(),
            is_international: location !== 'local',
            merchant_category: transactionType
        });

        // Create transaction record
        const transaction = new Transaction({
            user,
            amount,
            cardNumber,
            transactionType,
            location,
            fraudProbability: fraudPrediction.data.fraud_probability,
            flagged: fraudPrediction.data.is_fraudulent
        });

        // Save to database
        await transaction.save();

        // Log to blockchain if suspicious
        if (!fraudPrediction.data.is_fraudulent) {
            await BlockchainService.addTransaction(
                user, 
                amount, 
                true
            );
        }

        res.status(200).json({
            message: fraudPrediction.data.is_fraudulent 
                ? 'Suspicious transaction detected' 
                : 'Transaction normal',
            transaction
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
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ 
            error: 'Could not retrieve transactions', 
            details: error.message 
        });
    }
});

module.exports = router;
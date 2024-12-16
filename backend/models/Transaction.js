// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    senderOldBalance: {
        type: Number,
        required: true
    },
    senderNewBalance: {
        type: Number,
        required: true
    },
    receiverOldBalance: {
        type: Number,
        required: true
    },
    receiverNewBalance: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['Payment', 'Debit', 'Transfer','Cash-Out', 'Cash-In']
    },
    fraudProbability: {
        type: Number,
        default: 0
    },
    flagged: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Transaction', transactionSchema);
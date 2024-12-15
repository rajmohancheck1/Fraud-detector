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
    cardNumber: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['online', 'pos', 'international', 'other']
    },
    location: String,
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
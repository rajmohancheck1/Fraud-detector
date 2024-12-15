const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    user: String,
    amount: Number,
    flagged: Boolean,
});

module.exports = mongoose.model("Transaction", transactionSchema);

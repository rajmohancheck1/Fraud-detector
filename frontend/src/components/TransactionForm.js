// frontend/src/components/TransactionForm.js
import React, { useState } from 'react';
import axios from 'axios';

function TransactionForm() {
    const [transaction, setTransaction] = useState({
        user: '',
        amount: '',
        senderOldBalance: '',
        senderNewBalance: '',
        receiverOldBalance: '',
        receiverNewBalance: '',
        transactionType: '',
    });
    const [fraudPrediction, setFraudPrediction] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitTransaction = async (e) => {
        e.preventDefault();
        setError(null);
        setFraudPrediction(null);
    
        try {
            console.log('Submitting transaction:', transaction);
    
            const response =  await axios.post('http://localhost:3000/api/transactions', transaction);

    
            console.log('Server response:', response.data);
    
            const transactionData = response.data.transaction;
    
            setFraudPrediction({
                fraudProbability: transactionData?.fraudProbability || 0, // Default to 0 if not provided
                flagged: transactionData?.flagged || false // Default to false if not provided
            });
        } catch (error) {
            console.error('Error submitting transaction:', error);
            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Transaction submission failed. Please check your input or try again later.'
            );
        }
    };

    return (
        <div className="transaction-form">
            <h2>Submit Transaction</h2>
            <form onSubmit={submitTransaction}>
                <input
                    name="user"
                    value={transaction.user}
                    onChange={handleChange}
                    placeholder="User ID"
                    required
                />
                <input
                    name="amount"
                    type="number"
                    value={transaction.amount}
                    onChange={handleChange}
                    placeholder="Transaction Amount"
                    required
                />
                <input
                    name="senderOldBalance"
                    type="number"
                    value={transaction.senderOldBalance}
                    onChange={handleChange}
                    placeholder="Sender Old Balance"
                    required
                />
                <input
                    name="senderNewBalance"
                    type="number"
                    value={transaction.senderNewBalance}
                    onChange={handleChange}
                    placeholder="Sender New Balance"
                    required
                />
                <input
                    name="receiverOldBalance"
                    type="number"
                    value={transaction.receiverOldBalance}
                    onChange={handleChange}
                    placeholder="Receiver Old Balance"
                    required
                />
                <input
                    name="receiverNewBalance"
                    type="number"
                    value={transaction.receiverNewBalance}
                    onChange={handleChange}
                    placeholder="Receiver New Balance"
                    required
                />
                <select
                    name="transactionType"
                    value={transaction.transactionType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Transaction Type</option>
                    <option value="Payment">Payment</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Debit">Debit</option>
                    <option value="CashOut">CashOut</option>
                    <option value="CashIn">CashIn</option>
                </select>
                <button type="submit">Submit Transaction</button>
            </form>

            {error && (
                <div className="error-message">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {fraudPrediction && (
                <div className="fraud-prediction">
                    <h3>Fraud Analysis</h3>
                    <p>Fraud Probability: {(fraudPrediction.fraudProbability * 100).toFixed(2)}%</p>
                    <p>
                        Status: {fraudPrediction.flagged 
                            ? 'SUSPICIOUS TRANSACTION DETECTED!' 
                            : 'Transaction appears normal.'}
                    </p>
                </div>
            )}
        </div>
    );
}

export default TransactionForm;

// frontend/src/components/TransactionForm.js
import React, { useState } from 'react';
import axios from 'axios';

function TransactionForm() {
    const [transaction, setTransaction] = useState({
        user: '',
        amount: '',
        cardNumber: '',
        transactionType: '',
        location: ''
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
            // Submit transaction and get fraud prediction
            const response = await axios.post('/api/transactions', transaction);
            
            setFraudPrediction({
                fraudProbability: response.data.transaction.fraudProbability,
                flagged: response.data.transaction.flagged
            });

        } catch (error) {
            setError(error.response?.data?.error || 'Transaction submission failed');
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
                    name="cardNumber"
                    value={transaction.cardNumber}
                    onChange={handleChange}
                    placeholder="Card Number"
                    required
                />
                <select
                    name="transactionType"
                    value={transaction.transactionType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Transaction Type</option>
                    <option value="online">Online</option>
                    <option value="pos">Point of Sale</option>
                    <option value="international">International</option>
                </select>
                <input
                    name="location"
                    value={transaction.location}
                    onChange={handleChange}
                    placeholder="Transaction Location"
                />
                <button type="submit">Submit Transaction</button>
            </form>

            {error && (
                <div className="error-message">
                    {error}
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
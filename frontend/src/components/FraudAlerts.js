import React, { useEffect, useState } from 'react';
function FraudAlerts() {
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        fetch('/transactions')
            .then(res => res.json())
            .then(data => setTransactions(data));
    }, []);
    return (
        <div>
            <h1>Fraud Alerts</h1>
            {transactions.map((tx, idx) => (
                tx.flagged && <p key={idx}>{`User: ${tx.user}, Amount: ${tx.amount}`}</p>
            ))}
        </div>
    );
}
export default FraudAlerts;
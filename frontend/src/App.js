import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FraudAlerts from './components/FraudAlerts';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/alerts' element={<FraudAlerts />} />
            </Routes>
        </Router>
    );
}
export default App;
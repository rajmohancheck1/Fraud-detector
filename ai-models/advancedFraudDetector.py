# ai-models/advancedFraudDetector.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib
import json
import os

class AdvancedFraudDetector:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
    
    def load_training_data(self, data_path):
        """
        Load training data from CSV or JSON
        Expected columns: amount, timestamp, location, merchant_category, fraudulent
        """
        try:
            if data_path.endswith('.csv'):
                return pd.read_csv(data_path)
            elif data_path.endswith('.json'):
                return pd.read_json(data_path)
            else:
                raise ValueError("Unsupported file type. Use CSV or JSON.")
        except Exception as e:
            print(f"Error loading data: {e}")
            return None

    def prepare_data(self, data):
        """
        Preprocess and engineer features
        """
        # Feature engineering
        data['transaction_hour'] = pd.to_datetime(data['timestamp']).dt.hour
        data['is_international'] = (data['location'] != 'local').astype(int)
        
        features = [
            'amount', 
            'transaction_hour', 
            'is_international', 
            'merchant_category'
        ]
        
        X = data[features]
        y = data['fraudulent']
        
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def train(self, data_path):
        """
        Train the fraud detection model
        """
        data = self.load_training_data(data_path)
        if data is None:
            print("No training data available")
            return
        
        X_train, X_test, y_train, y_test = self.prepare_data(data)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Advanced Random Forest 
        self.model = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Model evaluation
        predictions = self.model.predict(X_test_scaled)
        print("Model Performance:")
        print(classification_report(y_test, predictions))

    def predict(self, transaction):
        """
        Predict fraud probability for a transaction
        """
        if self.model is None:
            raise ValueError("Model not trained. Train the model first.")
        
        # Preprocess transaction
        transaction_scaled = self.scaler.transform([transaction])
        fraud_probability = self.model.predict_proba(transaction_scaled)[0][1]
        
        return {
            'fraud_probability': float(fraud_probability),
            'is_fraudulent': fraud_probability > 0.7
        }

    def save_model(self, path='fraud_model.joblib'):
        """
        Save trained model and scaler
        """
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler
        }, path)

    @classmethod
    def load_model(cls, path='fraud_model.joblib'):
        """
        Load pre-trained model
        """
        saved_data = joblib.load(path)
        detector = cls()
        detector.model = saved_data['model']
        detector.scaler = saved_data['scaler']
        return detector

# Example usage script
def main():
    # Initialize detector
    detector = AdvancedFraudDetector()
    
    # Train with sample data
    detector.train('sample_transactions.csv')
    
    # Save model
    detector.save_model()
    
    # Example transaction prediction
    sample_transaction = [1000, 14, 0, 'online_shopping']
    result = detector.predict(sample_transaction)
    print(result)

if __name__ == "__main__":
    main()
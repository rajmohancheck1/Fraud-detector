# ai-models/predictAPI.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from advancedFraudDetector import AdvancedFraudDetector

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load pre-trained model
try:
    fraud_detector = AdvancedFraudDetector.load_model()
except FileNotFoundError:
    print("No pre-trained model found. Train the model first.")
    fraud_detector = None

@app.route('/predict', methods=['POST'])
def predict_fraud():
    if fraud_detector is None:
        return jsonify({
            'error': 'Model not trained',
            'status': 'Train the model first'
        }), 400
    
    try:
        # Extract transaction details
        data = request.json
        transaction_features = [
            data.get('amount', 0),
            data.get('transaction_hour', 0),
            data.get('is_international', 0),
            data.get('merchant_category', 'unknown')
        ]
        
        # Predict fraud
        prediction = fraud_detector.predict(transaction_features)
        
        return jsonify({
            'fraud_probability': prediction['fraud_probability'],
            'is_fraudulent': prediction['is_fraudulent']
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'Prediction failed'
        }), 500

@app.route('/train', methods=['POST'])
def train_model():
    try:
        # Get training data path from request
        data_path = request.json.get('data_path')
        
        if not data_path:
            return jsonify({
                'error': 'No data path provided',
                'status': 'Training failed'
            }), 400
        
        # Train new model
        detector = AdvancedFraudDetector()
        detector.train(data_path)
        detector.save_model()
        
        return jsonify({
            'status': 'Model trained successfully',
            'model_path': 'fraud_model.joblib'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'Training failed'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
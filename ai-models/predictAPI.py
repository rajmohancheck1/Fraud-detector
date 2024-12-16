from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
import pickle

# Initialize Flask app
app = Flask(__name__)

# Load the model
model_path = "fraud_detection_model.h5"
model = tf.keras.models.load_model(model_path)

# Load the OneHotEncoder (fit it once during training)
with open('encoder.pkl', 'rb') as f:
    encoder = pickle.load(f)

# Preprocessing function
def preprocess_single_record(record):
    """Preprocesses a single transaction record to match the model's expected format."""
    # Convert the record to a DataFrame
    record_df = pd.DataFrame([record])

    # Select numeric features
    numeric_features = record_df[['amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest']]

    # One-hot encode the 'type' column using pre-fitted encoder
    type_encoded = encoder.transform(record_df[['type']]).toarray()

    # Combine numeric features with encoded features
    processed_data = np.concatenate([type_encoded, numeric_features], axis=1)

    return processed_data  # Return as a 2D array

@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data from request
    data = request.get_json()

    # Validate input
    required_fields = ['type', 'amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest']
    if not all(field in data for field in required_fields):
        return jsonify({'error': f'Missing required fields. Required: {required_fields}'}), 400

    try:
        # Preprocess the single record
        features = preprocess_single_record(data)

        # Make prediction
        prediction = model.predict(features)[0]

        # Prepare response
        result = {
            'fraud_probability': float(prediction[0]),
            'is_fraud': bool(prediction[0] > 0.5)
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
# from flask import Flask, request, jsonify
# import pickle

# app = Flask(__name__)

# def load_model():
#     with open('fraud_model.pkl', 'rb') as file:
#         return pickle.load(file)

# model = load_model()

# @app.route('/predict', methods=['POST'])
# def predict():
#     data = request.json
#     amount = data['amount']
#     result = model.predict([[amount]])[0]
#     return jsonify({'fraudulent': bool(result)})

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify

app = Flask(__name__)

class DummyModel:
    
    def predict(self, X):
        return [1 if x[0] > 1000 else 0 for x in X]

def load_model():
    return DummyModel()

model = load_model()

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    amount = data['amount']
    result = model.predict([[amount]])[0]
    return jsonify({'fraudulent': bool(result)})

if __name__ == '__main__':
    app.run(debug=True)

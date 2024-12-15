import pickle
from sklearn.ensemble import RandomForestClassifier

# Example training data
data = [[100, 1], [200, 0], [1500, 1], [20, 0]]
labels = [0, 0, 1, 0]

model = RandomForestClassifier()
model.fit(data, labels)

# Save the model
with open("fraud_model.pkl", "wb") as file:
    pickle.dump(model, file)

# Predict function
def predict(amount):
    with open("fraud_model.pkl", "rb") as file:
        model = pickle.load(file)
    return model.predict([[amount]])[0]
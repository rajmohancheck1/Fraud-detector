import numpy as np
import pandas as pd
import seaborn as sns
import plotly.express as px
from matplotlib import pyplot as plt

from sklearn import metrics
from collections import Counter
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import RandomOverSampler

# No need to use pip install in the script
# Install the necessary libraries before running the script
# pip install catboost

from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC, LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier

from sklearn.ensemble import AdaBoostClassifier
from catboost import CatBoostClassifier
from sklearn.ensemble import GradientBoostingClassifier
from xgboost import XGBClassifier
import lightgbm as lgb

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.metrics import Precision, Recall, AUC
from keras.models import Sequential
from tensorflow.keras.models import Model, Sequential
from tensorflow.keras.layers import Activation, Input, Dense, LSTM
from tensorflow.keras.callbacks import EarlyStopping

import os
import sys

# Get the absolute path of the current working directory
current_dir = os.getcwd()

# Assuming BalanceDataset.py is in the same directory as the current notebook
# If it's in a subfolder, adjust the path accordingly
# e.g., for a subfolder named 'utils': parent_dir = os.path.join(current_dir, 'utils')
parent_dir = current_dir

# Add the parent directory (or subfolder) to the Python path
sys.path.append(parent_dir)

# Now import the modules
import BalanceDataset as balance
import MachineLearningModels as ml_models
import DeepLearningModels as dl_models

import shap

# Rest of your code...


import os
import sys

# Get the absolute path of the current working directory
current_dir = os.getcwd()

# Assuming BalanceDataset.py is in the same directory as the current notebook
# If it's in a subfolder, adjust the path accordingly
# e.g., for a subfolder named 'utils': parent_dir = os.path.join(current_dir, 'utils')
parent_dir = current_dir

# Add the parent directory (or subfolder) to the Python path
sys.path.append(parent_dir)

# Now import the modules
import BalanceDataset as balance
import MachineLearningModels as ml_models
import DeepLearningModels as dl_models

import shap

"""## Dataset Description

- step - maps a unit of time in the real world. In this case 1 step is 1 hour of time. Total steps 744 (30 days simulation).
- type - CASH-IN, CASH-OUT, DEBIT, PAYMENT and TRANSFER.
- amount - amount of the transaction in local currency.
- nameOrig - customer who started the transaction
- oldbalanceOrg - initial balance before the transaction
- newbalanceOrig - new balance after the transaction
- nameDest - customer who is the recipient of the transaction
- oldbalanceDest - initial balance recipient before the transaction. Note that there is not information for customers that start with M (Merchants).
- newbalanceDest - new balance recipient after the transaction. Note that there is not information for customers that start with M (Merchants).
- isFraud - This is the transactions made by the fraudulent agents inside the simulation. In this specific dataset the fraudulent behavior of the agents aims to profit by taking control or customers accounts and try to empty the funds by transferring to another account and then cashing out of the system.
- isFlaggedFraud - The business model aims to control massive transfers from one account to another and flags illegal attempts. An illegal attempt in this dataset is an attempt to transfer more than 200.000 in a single transaction.
"""

data = pd.read_csv("G:\Fraud-detector\Paysim.csv.zip")
df = data.copy()

df.head()

df.shape

df.info()

df.isnull().sum()

df.duplicated().sum()

df.nunique()

df = df.drop(columns = ['step', 'isFlaggedFraud'], axis = 'columns')

df.type.unique()

#fig = px.box(df, y="amount")
#fig.show()

"""## EDA"""

df['isFraud'].value_counts()

# İşlemlerin yapıldığı kaynağın kontrol edilmesi.
transfer_df = df[((df['type']=='TRANSFER') & df['isFraud']==1)]
transfer_df['nameOrig'].value_counts()

# İşlemlerin nakde çevrildiği varış noktasının kontrol edilmesi.
cash_out_fraud = df[(df['type'] == 'CASH_OUT') & (df['isFraud'] == 1)]
cash_out_fraud['nameDest'].value_counts()

fraud_trans = df[df['isFraud'] == 1]
valid_trans = df[df['isFraud'] == 0]

trans_transfer = df[df['type'] == 'TRANSER']
trans_cashout = df[df['type'] == 'CASH_OUT']

print('Nakit çekmek için kullanılan alıcı hesabı var mı?')
trans_transfer.nameDest.isin(trans_cashout.nameOrig).any()

plt.figure(figsize=(10,5))
# Only include numerical features for correlation calculation
numeric_df = df.select_dtypes(include=np.number)
sns.heatmap(numeric_df.corr(),annot=True);

sns.violinplot(x = df['isFraud'],y = df['amount']);

#sns.boxplot(x=df.isFraud,y=df.step);
df_with_step = data.copy()  # Create a copy of the original data
df = df_with_step.drop(columns=['step', 'isFlaggedFraud'], axis='columns')  # Drop from original df

# ... (rest of your code) ...

sns.boxplot(x=df_with_step.isFraud, y=df_with_step.step);  # Use df_with_step for the plot

plt.figure(figsize=(10,8))
plt.pie(df.type.value_counts().values,labels=df.type.value_counts().index,  autopct='%.0f%%')
plt.title("Transaction Type")
plt.show()

from sklearn.preprocessing import LabelEncoder
encoder = {}
for i in df.select_dtypes('object').columns:
    encoder[i] = LabelEncoder()
    df[i] = encoder[i].fit_transform(df[i])

"""df=pd.concat([df,pd.get_dummies(df['type'], prefix='type_')],axis=1)
df.drop(['type'],axis=1,inplace = True)

df.head()

## Sonuçlar

* Dolandırıcılık işlemlerimiz TRANSFER ve CASH_OUT işlem tipinde yapılmaktadır.

* TRANSFER'deki dolandırıcılık işlemleri 4097 ve CASH_OUT 4116 adet.

* Dolandırıcılık işlemleri genellikle Müşteriden Müşteriye yapılmakta.

* Alım ve Gönderim için kullanılan işlem hesabı, Dolandırıcılık işlemlerinde Aynı değil.

## Preprocessing
"""

numeric_columns = df.select_dtypes(include=['float64', 'int64']).columns
numeric_columns.size

def boxplots_custom(dataset, columns_list, rows, cols, suptitle):
    fig, axs = plt.subplots(rows, cols, sharey=True, figsize=(25,16))
    fig.suptitle(suptitle,y=1, size=25)
    axs = axs.flatten()
    for i, data in enumerate(columns_list):
        sns.boxplot(data=dataset[data], orient='h', ax=axs[i])
        axs[i].set_title(data + ', skewness is: '+str(round(dataset[data].skew(axis = 0, skipna = True),2)))

boxplots_custom(dataset=df, columns_list=numeric_columns, rows=int(numeric_columns.size/3)+1, cols=3, suptitle='Boxplots for each variable')
plt.tight_layout()

"""## Feature Engineering (chi2, ANNOVA)

### ...

## Model Oluşturma
"""

#df.drop(columns=['type','nameOrig','nameDest'], inplace=True)
df.drop(columns=['nameOrig','nameDest'], inplace=True)

X = df.drop('isFraud', axis=1)
y = df['isFraud']

#scaler = StandardScaler()
#X_scaled = scaler.fit_transform(X)

from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
X = scaler.fit_transform(X)

#X_train, X_test, y_train, y_test = train_test_split(X_chi2, y, test_size = 0.30, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.30, random_state=42, stratify=y)

"""sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)
"""

X_train_ros, y_train_ros = balance.balancedWithRandomOverSampler(X_train,y_train)

X_train_rus, y_train_rus = balance.balancedWithRandomUnderSampler(X_train,y_train)

X_train_smote, y_train_smote = balance.balanceWithSMOTE(X_train, y_train)

X_train_adasyn, y_train_adasyn = balance.balanceWithADASYN(X_train, y_train)

"""# DEEP LEARNING

## Preprocessing
"""

dl_model_performances= pd.DataFrame(columns=["model_name","precision","recall","f1_score","AUC"])

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

parameters={
    'X_train_scaled' : X_train_scaled,
    'X_test_scaled' : X_test_scaled,
    'y_train' : y_train,
    'y_test' : y_test
}

dl_models_list= [
            dl_models.ANN_model(**parameters),
            dl_models.RNN_model(**parameters),
            dl_models.LSTM_model(**parameters)

]

for i in range(len(dl_models_list)): # Change dl_models to dl_models_list
        dl_model_performances.loc[len(dl_model_performances.index)] = dl_models_list[i] # Change dl_models to dl_models_list

dl_model_performances.sort_values(by=['f1_score','AUC'],
                                  ascending=False).reset_index(drop=True)

final_result = pd.concat([ dl_model_performances])

final_result.sort_values(by=['f1_score','AUC'],
                                  ascending=False).reset_index(drop=True)

dl_model_performances

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential
from keras.layers import Dense

# Create the Autoencoder model
model = Sequential()
model.add(Dense(64, activation='relu', input_shape=(X_train.shape[1],)))
model.add(Dense(X_train.shape[1], activation='sigmoid'))

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy')

# Train the model
model.fit(X_train, X_train, epochs=10, batch_size=64, validation_data=(X_test, X_test))

# Use the trained Autoencoder for anomaly detection
reconstructed_data = model.predict(X_test)
mse = np.mean(np.power(X_test - reconstructed_data, 2), axis=1)
threshold = np.mean(mse) + np.std(mse)  # Define a threshold for anomaly detection

# Classify instances as fraudulent or non-fraudulent based on the threshold
y_pred = [1 if error > threshold else 0 for error in mse]

# Evaluate the model
accuracy = np.mean(np.equal(y_test, y_pred))
print("Accuracy:", accuracy)

model.save('fraud_detection_model.h5')

from keras.models import load_model

loaded_model = load_model('fraud_detection_model.h5')  # Or .keras
loaded_model.summary()
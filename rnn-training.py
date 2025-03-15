import os
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, BatchNormalization, LeakyReLU, Dropout, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Define the folder containing data
data_folder = "./mouseData"

# Function to load CSV files from the folder
def load_data_from_folder(folder_path):
    all_data = []
    all_labels = []
    
    for file in os.listdir(folder_path):
        if file.endswith(".txt"):  # Ensure only CSV files are read
            file_path = os.path.join(folder_path, file)
            df = pd.read_txt(file_path)

            # Assuming the first 10 columns are features and the last column is the label
            X = df.iloc[:, :10].values  # First 10 columns as features
            y = df.iloc[:, -1].values   # Last column as labels
            
            all_data.append(X)
            all_labels.append(y)

    return np.array(all_data), np.array(all_labels)







# Load data
X, y = load_data_from_folder(data_folder)

# Reshape X to be (num_samples, sequence_length, num_features)
X = np.array(X)  # Shape: (num_samples, sequence_length, 10)

# Encode labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)  # Convert labels to numeric values
y_onehot = tf.keras.utils.to_categorical(y_encoded, num_classes=2)  # One-hot encoding

# Train-test split
X_train, X_val, y_train, y_val = train_test_split(X, y_onehot, test_size=0.2, random_state=42)

# Define the model
model = Sequential([
    LSTM(128, return_sequences=True, input_shape=(X_train.shape[1], 10), recurrent_dropout=0.5, name="lstm_LSTM1"),
    BatchNormalization(name="batch_normalization_BatchNormalization1"),
    LeakyReLU(alpha=0.1, name="leaky_re_lu_LeakyReLU1"),
    Dropout(0.3, name="dropout_Dropout1"),
    LSTM(64, return_sequences=False, recurrent_dropout=0.3, name="lstm_LSTM2"),
    LeakyReLU(alpha=0.1, name="leaky_re_lu_LeakyReLU2"),
    Dropout(0.1, name="dropout_Dropout2"),
    Dense(2, activation='softmax', name="dense_Dense1")
])

# Compile the model
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)



# Train the model
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=50,
    batch_size=32,
    callbacks=callbacks
)

# Save trained model weights
model.save_weights("./rnn1_trained.bin")

# Evaluate on validation set
val_loss, val_acc = model.evaluate(X_val, y_val)
print(f"Validation Accuracy: {val_acc:.4f}")

from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import random
import time
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor  # Importing RandomForest
from sklearn.preprocessing import StandardScaler  # To scale features for better model performance

app = Flask(__name__)
CORS(app)

class Benchmark:
    def __init__(self):
        self.latency_stateful = []
        self.latency_stateless = []
        self.throughput_stateful = []
        self.throughput_stateless = []
        self.cpu_usage_stateful = []
        self.cpu_usage_stateless = []
        self.memory_usage_stateful = []
        self.memory_usage_stateless = []
        self.running = False
        self.stop_signal = threading.Event()
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)  # Initialize Random Forest model
        self.scaler = StandardScaler()  # Scaler for feature normalization

        # Fit the model with some initial data
        self.train_model()

    def simulate_packet(self):
        return random.choice(['short', 'long'])

    def stateful_filtering(self):
        latency = random.uniform(0.01, 0.05)
        self.latency_stateful.append(latency)

        cpu_usage = random.uniform(30, 70) + (latency * 100)
        memory_usage = random.uniform(40, 80) + (latency * 50)
        cpu_usage = min(100, max(0, cpu_usage))
        memory_usage = min(100, max(0, memory_usage))

        self.cpu_usage_stateful.append(cpu_usage)
        self.memory_usage_stateful.append(memory_usage)

        # Use machine learning model to predict throughput based on CPU usage, memory usage, and latency
        features = np.array([[latency, cpu_usage, memory_usage]])
        features_scaled = self.scaler.transform(features)  # Scale features before prediction
        throughput = self.model.predict(features_scaled)[0]  # Predict throughput
        self.throughput_stateful.append(throughput)
        #print(self)

    def stateless_filtering(self):
        latency = random.uniform(0.01, 0.03)
        self.latency_stateless.append(latency)

        cpu_usage = random.uniform(20, 50) + (latency * 60)
        memory_usage = random.uniform(30, 60) + (latency * 40)
        cpu_usage = min(100, max(0, cpu_usage))
        memory_usage = min(100, max(0, memory_usage))

        self.cpu_usage_stateless.append(cpu_usage)
        self.memory_usage_stateless.append(memory_usage)

        throughput = max(0.7, 1 - latency * 3)
        self.throughput_stateless.append(throughput)

    def train_model(self):
        # This is a simple example where we simulate some initial training data
        # For real applications, you would gather real-world data
        latency = np.random.uniform(0.01, 0.05, 1000)
        cpu_usage = np.random.uniform(30, 70, 1000) + latency * 100
        memory_usage = np.random.uniform(40, 80, 1000) + latency * 50
        throughput = 1 - (latency * 5)  # Example linear relationship for throughput

        # Feature matrix (latency, cpu_usage, memory_usage)
        X = np.vstack((latency, cpu_usage, memory_usage)).T
        y = throughput

        # Scale features for better model performance
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)  # Train the model

    def get_data(self):
        return {
            "latency_stateful": self.latency_stateful or [],
            "latency_stateless": self.latency_stateless or [],
            "throughput_stateful": self.throughput_stateful or [],
            "throughput_stateless": self.throughput_stateless or [],
            "cpu_usage_stateful": self.cpu_usage_stateful or [],
            "cpu_usage_stateless": self.cpu_usage_stateless or [],
            "memory_usage_stateful": self.memory_usage_stateful or [],
            "memory_usage_stateless": self.memory_usage_stateless or []
        }

    def start_benchmarking(self):
        self.running = True
        self.stop_signal.clear()
        start_time = time.time()

        while self.running and time.time() - start_time < 61:
            if self.stop_signal.is_set():
                break
            self.stateful_filtering()
            self.stateless_filtering()
            time.sleep(1)

    def stop_benchmarking(self):
        self.running = False
        self.stop_signal.set()
        self.clear_data()

    def clear_data(self):
        self.latency_stateful.clear()
        self.latency_stateless.clear()
        self.throughput_stateful.clear()
        self.throughput_stateless.clear()
        self.cpu_usage_stateful.clear()
        self.cpu_usage_stateless.clear()
        self.memory_usage_stateful.clear()
        self.memory_usage_stateless.clear()

benchmark = Benchmark()

@app.route('/start', methods=['GET'])
def start_benchmark():
    benchmark.stop_benchmarking()
    threading.Thread(target=benchmark.start_benchmarking).start()
    return "Benchmarking started."

@app.route('/stop', methods=['GET'])
def stop_benchmark():
    benchmark.stop_benchmarking()
    return "Benchmarking stopped."

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(benchmark.get_data())

@app.route('/save', methods=['POST'])
def save_data():
    file_name = request.json.get('file_name', 'benchmark_data.json')
    try:
        data = benchmark.get_data()
        with open(file_name, 'w') as file:
            json.dump(data, file, indent=4)
        return jsonify({"message": f"Data saved to {file_name}."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8007)

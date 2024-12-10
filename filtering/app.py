import matplotlib
matplotlib.use('Agg')  # Use a non-GUI backend

import matplotlib.pyplot as plt
import random
import time
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your React frontend

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

    def simulate_packet(self):
        return random.choice(['short', 'long'])

    def stateful_filtering(self):
        latency = random.uniform(0.01, 0.05)
        self.latency_stateful.append(latency)

        # Simulate CPU and Memory Usage based on latency
        cpu_usage = random.uniform(30, 70) + (latency * 100)
        memory_usage = random.uniform(40, 80) + (latency * 50)

        # Clamping values to reasonable ranges
        cpu_usage = min(100, max(0, cpu_usage))
        memory_usage = min(100, max(0, memory_usage))

        self.cpu_usage_stateful.append(cpu_usage)
        self.memory_usage_stateful.append(memory_usage)

        # Simulate throughput decrease with higher latency
        throughput = max(0.5, 1 - latency * 5)
        self.throughput_stateful.append(throughput)

    def stateless_filtering(self):
        latency = random.uniform(0.01, 0.03)
        self.latency_stateless.append(latency)

        # Simulate CPU and Memory Usage based on latency
        cpu_usage = random.uniform(20, 50) + (latency * 60)
        memory_usage = random.uniform(30, 60) + (latency * 40)

        # Clamping values to reasonable ranges
        cpu_usage = min(100, max(0, cpu_usage))
        memory_usage = min(100, max(0, memory_usage))

        self.cpu_usage_stateless.append(cpu_usage)
        self.memory_usage_stateless.append(memory_usage)

        # Simulate throughput decrease with higher latency
        throughput = max(0.7, 1 - latency * 3)
        self.throughput_stateless.append(throughput)

    def get_data(self):
        return {
            "latency_stateful": self.latency_stateful,
            "latency_stateless": self.latency_stateless,
            "throughput_stateful": self.throughput_stateful,
            "throughput_stateless": self.throughput_stateless,
            "cpu_usage_stateful": self.cpu_usage_stateful,
            "cpu_usage_stateless": self.cpu_usage_stateless,
            "memory_usage_stateful": self.memory_usage_stateful,
            "memory_usage_stateless": self.memory_usage_stateless
        }

benchmark = Benchmark()

def update_data():
    """Simulate the data generation every second."""
    start_time = time.time()
    while time.time() - start_time < 60:  # Run for 1 minute
        benchmark.stateful_filtering()
        benchmark.stateless_filtering()
        time.sleep(1)

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/data")
def data():
    return jsonify(benchmark.get_data())

@app.route("/start")
def start():
    """Start the background data update thread."""
    benchmark.latency_stateful.clear()
    benchmark.latency_stateless.clear()
    benchmark.throughput_stateful.clear()
    benchmark.throughput_stateless.clear()
    benchmark.cpu_usage_stateful.clear()
    benchmark.cpu_usage_stateless.clear()
    benchmark.memory_usage_stateful.clear()
    benchmark.memory_usage_stateless.clear()
    
    threading.Thread(target=update_data).start()
    return "Data generation started."

if __name__ == "__main__":
    app.run(debug=True, port=8005)

from flask import Flask, jsonify, request  # Add request for handling input
from flask_cors import CORS  # Import CORS
import threading
import random
import time
import json  # Import json for file handling

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        self.stop_signal = threading.Event()  # Event to handle stopping the process

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

        throughput = max(0.5, 1 - latency * 5)
        self.throughput_stateful.append(throughput)

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
        self.stop_signal.clear()  # Reset stop signal for a new benchmarking round
        start_time = time.time()

        while self.running and time.time() - start_time < 61:
            if self.stop_signal.is_set():  # Check for stop signal
                break
            self.stateful_filtering()
            self.stateless_filtering()
            time.sleep(1)

    def stop_benchmarking(self):
        self.running = False
        self.stop_signal.set()  # Set the stop signal to stop benchmarking
        self.clear_data()

    def clear_data(self):
        # Clear the data when restarting the benchmarking
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
    benchmark.stop_benchmarking()  # Stop any previous benchmarking
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
    app.run(debug=True, host='0.0.0.0', port=8005)

from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import random
import time
import json
import pyshark  # To capture packets using Pyshark
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import ssl
import socket

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Benchmarking class
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


# Encryption and Decryption functions for AES
def encrypt_data(data, key):
    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(data.encode())
    return cipher.nonce + tag + ciphertext

def decrypt_data(data, key):
    nonce, tag, ciphertext = data[:16], data[16:32], data[32:]
    cipher = AES.new(key, AES.MODE_EAX, nonce=nonce)
    decrypted_data = cipher.decrypt_and_verify(ciphertext, tag)
    return decrypted_data.decode()

# Function for setting up TLS 1.2 connection over TCP
def start_tls_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('0.0.0.0', 9000))
    server_socket.listen(5)

    context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    context.load_cert_chain(certfile="server.crt", keyfile="server.key")
    tls_socket = context.wrap_socket(server_socket, server_side=True)

    print("TLS server started on port 9000...")
    while True:
        client_socket, _ = tls_socket.accept()
        with client_socket:
            client_socket.send(b"Hello, TLS client!")
            client_socket.close()

# Real-time packet capturing using Pyshark
def capture_packets():
    capture = pyshark.LiveCapture(interface='eth0')  # Change 'eth0' to your network interface
    for packet in capture.sniff_continuously():
        print(f"Packet: {packet}")

# Flask routes for Benchmarking
benchmark = Benchmark()

@app.route('/start', methods=['POST'])
def start_benchmark():
    data = request.json
    print(f"Received Input: {data}")  # For logging and debugging
    
    benchmark.stop_benchmarking()
    threading.Thread(target=benchmark.start_benchmarking).start()
    return jsonify({"message": "Benchmarking started."}), 200

@app.route('/stop', methods=['GET'])
def stop_benchmark():
    benchmark.stop_benchmarking()
    return jsonify({"message": "Benchmarking stopped."})

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
    threading.Thread(target=start_tls_server).start()
    threading.Thread(target=capture_packets).start()

    context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
    context.load_cert_chain(certfile="server.crt", keyfile="server.key")
    app.run(debug=True, host='0.0.0.0', port=8005, ssl_context=context)

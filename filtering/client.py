import requests
import json

BASE_URL = "https://localhost:8005"  # Server's URL (adjust for deployment)

# Function to start benchmarking
def start_benchmark(data):
    response = requests.post(f"{BASE_URL}/start", json=data, verify=False)
    if response.status_code == 200:
        print("Benchmarking started successfully!")
    else:
        print(f"Failed to start benchmarking: {response.text}")

# Function to stop benchmarking
def stop_benchmark():
    response = requests.get(f"{BASE_URL}/stop", verify=False)
    if response.status_code == 200:
        print("Benchmarking stopped successfully!")
    else:
        print(f"Failed to stop benchmarking: {response.text}")

# Function to retrieve benchmark data
def get_data():
    response = requests.get(f"{BASE_URL}/data", verify=False)
    if response.status_code == 200:
        print("Benchmark data:")
        print(json.dumps(response.json(), indent=4))
    else:
        print(f"Failed to retrieve data: {response.text}")

# Function to save benchmark data
def save_data(file_name="benchmark_data.json"):
    response = requests.post(f"{BASE_URL}/save", json={"file_name": file_name}, verify=False)
    if response.status_code == 200:
        print(f"Data saved to {file_name}.")
    else:
        print(f"Failed to save data: {response.text}")

if __name__ == '__main__':
    # Example: Start benchmarking
    test_data = {
        "traffic_type": "UDP",
        "filter_mode": "stateful",
        "stateful_stateless": "stateful",
        "test_duration": 60,
        "traffic_volume": "medium",
        "num_connections": 10,
        "protocol": "UDP",
        "network_topology": "star",
        "packet_size": "large",
        "simulate_network_latency": True,
        "simulate_packet_loss": True,
        "bandwidth_limit": "1Gbps"
    }
    
    start_benchmark(test_data)
    get_data()
    save_data()

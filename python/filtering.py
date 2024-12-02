import time
import random
import psutil
import threading
from collections import deque
from datetime import datetime

# Simulate Stateful vs Stateless Filtering Performance
class FilteringBenchmark:
    def __init__(self):
        self.stateful_connections = {}
        self.stateless_connections = deque()
        self.packet_size = 1024  # bytes
        self.stateful_latency = []
        self.stateless_latency = []
        self.stateful_throughput = 0
        self.stateless_throughput = 0
        self.cpu_usage_stateful = []
        self.cpu_usage_stateless = []
        self.memory_usage_stateful = []
        self.memory_usage_stateless = []

    def simulate_packet(self):
        """Simulates a single network packet."""
        return random.choice(['short', 'long'])

    def stateful_filtering(self, connection_type):
        """Simulates stateful filtering."""
        start_time = time.time()
        connection_id = random.randint(1000, 9999)

        # Check for existing connection
        if connection_id in self.stateful_connections:
            # Update the connection state
            self.stateful_connections[connection_id]['last_seen'] = time.time()
        else:
            # Establish new connection and store state
            self.stateful_connections[connection_id] = {
                'type': connection_type,
                'last_seen': time.time()
            }

        # Measure latency
        latency = time.time() - start_time
        self.stateful_latency.append(latency)

        # Simulate CPU and memory usage
        self.cpu_usage_stateful.append(psutil.cpu_percent())
        self.memory_usage_stateful.append(psutil.virtual_memory().percent)

        # Simulate throughput (packets per second)
        self.stateful_throughput += self.packet_size

    def stateless_filtering(self, connection_type):
        """Simulates stateless filtering."""
        start_time = time.time()

        # Process packet independently (no state tracking)
        self.stateless_connections.append({
            'type': connection_type,
            'received_at': time.time()
        })

        # Measure latency
        latency = time.time() - start_time
        self.stateless_latency.append(latency)

        # Simulate CPU and memory usage
        self.cpu_usage_stateless.append(psutil.cpu_percent())
        self.memory_usage_stateless.append(psutil.virtual_memory().percent)

        # Simulate throughput (packets per second)
        self.stateless_throughput += self.packet_size

    def run_benchmark(self, num_packets=1000, interval=0.01):
        """Runs the benchmark by sending packets for both stateful and stateless filtering."""
        for _ in range(num_packets):
            packet_type = self.simulate_packet()

            # Simulate stateful filtering
            self.stateful_filtering(packet_type)

            # Simulate stateless filtering
            self.stateless_filtering(packet_type)

            time.sleep(interval)

    def generate_report(self):
        """Generates a comparison report between stateful and stateless filtering."""
        print("\n*** Performance Comparison Report ***\n")

        # Latency comparison
        avg_stateful_latency = sum(self.stateful_latency) / len(self.stateful_latency)
        avg_stateless_latency = sum(self.stateless_latency) / len(self.stateless_latency)
        print(f"Average Latency (Stateful): {avg_stateful_latency:.6f} seconds")
        print(f"Average Latency (Stateless): {avg_stateless_latency:.6f} seconds")

        # Throughput comparison
        print(f"Throughput (Stateful): {self.stateful_throughput / (1024*1024):.2f} MB")
        print(f"Throughput (Stateless): {self.stateless_throughput / (1024*1024):.2f} MB")

        # CPU usage comparison
        avg_cpu_stateful = sum(self.cpu_usage_stateful) / len(self.cpu_usage_stateful)
        avg_cpu_stateless = sum(self.cpu_usage_stateless) / len(self.cpu_usage_stateless)
        print(f"Average CPU Usage (Stateful): {avg_cpu_stateful:.2f}%")
        print(f"Average CPU Usage (Stateless): {avg_cpu_stateless:.2f}%")

        # Memory usage comparison
        avg_mem_stateful = sum(self.memory_usage_stateful) / len(self.memory_usage_stateful)
        avg_mem_stateless = sum(self.memory_usage_stateless) / len(self.memory_usage_stateless)
        print(f"Average Memory Usage (Stateful): {avg_mem_stateful:.2f}%")
        print(f"Average Memory Usage (Stateless): {avg_mem_stateless:.2f}%")

        # Summary
        print("\nStateful filtering tracks connections, introducing more latency and higher CPU/memory usage.")
        print("Stateless filtering treats packets independently, resulting in lower latency but at the cost of connection awareness.")
    
    
# Main code to run the benchmark and generate report
if __name__ == "__main__":
    benchmark = FilteringBenchmark()

    print("Running performance benchmark... This may take a few moments.")
    benchmark.run_benchmark(num_packets=1000, interval=0.01)

    # Generate comparison report
    benchmark.generate_report()

import time
import random
import psutil
import threading
import matplotlib.pyplot as plt
from collections import deque
from datetime import datetime

class FilteringBenchmark:
    def __init__(self):
        self.stateful_connections = {}
        self.stateless_connections = deque()
        self.packet_size = 1024  # bytes
        self.stateful_latency = []
        self.stateless_latency = []
        self.stateful_throughput = []
        self.stateless_throughput = []
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

        if connection_id in self.stateful_connections:
            self.stateful_connections[connection_id]['last_seen'] = time.time()
        else:
            self.stateful_connections[connection_id] = {
                'type': connection_type,
                'last_seen': time.time()
            }

        latency = time.time() - start_time
        self.stateful_latency.append(latency)
        self.cpu_usage_stateful.append(psutil.cpu_percent())
        self.memory_usage_stateful.append(psutil.virtual_memory().percent)
        self.stateful_throughput.append(self.packet_size)

    def stateless_filtering(self, connection_type):
        """Simulates stateless filtering."""
        start_time = time.time()
        self.stateless_connections.append({
            'type': connection_type,
            'received_at': time.time()
        })

        latency = time.time() - start_time
        self.stateless_latency.append(latency)
        self.cpu_usage_stateless.append(psutil.cpu_percent())
        self.memory_usage_stateless.append(psutil.virtual_memory().percent)
        self.stateless_throughput.append(self.packet_size)

    def run_benchmark(self, num_packets=1000, interval=0.01):
        for _ in range(num_packets):
            packet_type = self.simulate_packet()
            self.stateful_filtering(packet_type)
            self.stateless_filtering(packet_type)
            time.sleep(interval)

    def generate_report(self):
        avg_stateful_latency = sum(self.stateful_latency) / len(self.stateful_latency)
        avg_stateless_latency = sum(self.stateless_latency) / len(self.stateless_latency)
        print("\n*** Performance Comparison Report ***\n")
        print(f"Average Latency (Stateful): {avg_stateful_latency:.6f} seconds")
        print(f"Average Latency (Stateless): {avg_stateless_latency:.6f} seconds")
        print(f"Throughput (Stateful): {sum(self.stateful_throughput) / (1024*1024):.2f} MB")
        print(f"Throughput (Stateless): {sum(self.stateless_throughput) / (1024*1024):.2f} MB")
        avg_cpu_stateful = sum(self.cpu_usage_stateful) / len(self.cpu_usage_stateful)
        avg_cpu_stateless = sum(self.cpu_usage_stateless) / len(self.cpu_usage_stateless)
        print(f"Average CPU Usage (Stateful): {avg_cpu_stateful:.2f}%")
        print(f"Average CPU Usage (Stateless): {avg_cpu_stateless:.2f}%")
        avg_mem_stateful = sum(self.memory_usage_stateful) / len(self.memory_usage_stateful)
        avg_mem_stateless = sum(self.memory_usage_stateless) / len(self.memory_usage_stateless)
        print(f"Average Memory Usage (Stateful): {avg_mem_stateful:.2f}%")
        print(f"Average Memory Usage (Stateless): {avg_mem_stateless:.2f}%")
        self.plot_results()

    def plot_results(self):
        plt.figure(figsize=(10, 5))

        plt.subplot(2, 2, 1)
        plt.plot(self.stateful_latency, label='Stateful Latency', color='blue')
        plt.plot(self.stateless_latency, label='Stateless Latency', color='orange')
        plt.title('Latency Comparison')
        plt.xlabel('Test Number')
        plt.ylabel('Latency (seconds)')
        plt.legend()
        plt.grid()

        plt.subplot(2, 2, 2)
        plt.plot(self.stateful_throughput, label='Stateful Throughput', color='green')
        plt.plot(self.stateless_throughput, label='Stateless Throughput', color='red')
        plt.title('Throughput Comparison')
        plt.xlabel('Test Number')
        plt.ylabel('Throughput (bytes)')
        plt.legend()
        plt.grid()

        plt.subplot(2, 2, 3)
        plt.plot(self.cpu_usage_stateful, label='Stateful CPU Usage', color='purple')
        plt.plot(self.cpu_usage_stateless, label='Stateless CPU Usage', color='cyan')
        plt.title('CPU Usage Comparison')
        plt.xlabel('Test Number')
        plt.ylabel('CPU Usage (%)')
        plt.legend()
        plt.grid()

        plt.subplot(2, 2, 4)
        plt.plot(self.memory_usage_stateful, label='Stateful Memory Usage', color='brown')
        plt.plot(self.memory_usage_stateless, label='Stateless Memory Usage', color='pink')
        plt.title('Memory Usage Comparison')
        plt.xlabel('Test Number')
        plt.ylabel('Memory Usage (%)')
        plt.legend()
        plt.grid()

        plt.tight_layout()
        plt.show()

def run_stateful_traffic(benchmark, num_packets, interval):
    for _ in range(num_packets):
        benchmark.stateful_filtering(benchmark.simulate_packet())
        time.sleep(interval)

def run_stateless_traffic(benchmark, num_packets, interval):
    for _ in range(num_packets):
        benchmark.stateless_filtering(benchmark.simulate_packet())
        time.sleep(interval)

if __name__ == "__main__":
    benchmark = FilteringBenchmark()
    print("Running performance benchmark... This may take a few moments.")
    benchmark.run_benchmark(num_packets=1000, interval=0.01)
    benchmark.generate_report()

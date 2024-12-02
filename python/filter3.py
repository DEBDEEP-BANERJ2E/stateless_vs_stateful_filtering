import time
import random
import psutil
import matplotlib.pyplot as plt
from collections import deque

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
        """Simulates a single network packet."""
        return random.choice(['short', 'long'])

    def stateful_filtering(self, connection_type):
        """Simulates stateful filtering."""
        start_time = time.time()
        connection_id = random.randint(1000, 9999)

        # Simulate stateful connection management
        latency = time.time() - start_time
        self.latency_stateful.append(latency)
        self.cpu_usage_stateful.append(psutil.cpu_percent())
        self.memory_usage_stateful.append(psutil.virtual_memory().percent)
        self.throughput_stateful.append(0.97)  # Example value for simulation
        return latency

    def stateless_filtering(self, connection_type):
        """Simulates stateless filtering."""
        start_time = time.time()
        latency = time.time() - start_time
        self.latency_stateless.append(latency)
        self.cpu_usage_stateless.append(psutil.cpu_percent())
        self.memory_usage_stateless.append(psutil.virtual_memory().percent)
        self.throughput_stateless.append(0.98)  # Example value for simulation
        return latency

    def plot_results(self):
        """Plots the benchmark results for latency, throughput, CPU, and memory usage."""
        plt.figure(figsize=(10, 5))

        # Plot Latency
        plt.subplot(2, 2, 1)
        plt.plot(self.latency_stateful, label='Stateful Latency', color='blue')
        plt.plot(self.latency_stateless, label='Stateless Latency', color='orange')
        plt.title('Latency Comparison')
        plt.xlabel('Test Number')
        plt.ylabel('Latency (seconds)')
        plt.legend()
        plt.grid()

        # Plot Throughput
        plt.subplot(2, 2, 2)
        plt.plot(self.throughput_stateful, label='Stateful Throughput', color='green')
        plt.plot(self.throughput_stateless, label='Stateless Throughput', color='red')
        plt.title('Throughput Comparison')
        plt.xlabel('Test Number')
        plt.ylabel('Throughput (MB)')
        plt.legend()
        plt.grid()

        # Plot CPU Usage
        plt.subplot(2, 2, 3)
        plt.plot(self.cpu_usage_stateful, label='Stateful CPU Usage', color='purple')
        plt.plot(self.cpu_usage_stateless, label='Stateless CPU Usage', color='cyan')
        plt.title('CPU Usage Comparison')
        plt.xlabel('Test Number')
        plt.ylabel('CPU Usage (%)')
        plt.legend()
        plt.grid()

        # Plot Memory Usage
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

    def generate_report(self):
        """Generates a summary report and displays the plot results."""
        avg_stateful_latency = sum(self.latency_stateful) / len(self.latency_stateful)
        avg_stateless_latency = sum(self.latency_stateless) / len(self.latency_stateless)
        avg_throughput_stateful = sum(self.throughput_stateful) / len(self.throughput_stateful)
        avg_throughput_stateless = sum(self.throughput_stateless) / len(self.throughput_stateless)
        avg_cpu_stateful = sum(self.cpu_usage_stateful) / len(self.cpu_usage_stateful)
        avg_cpu_stateless = sum(self.cpu_usage_stateless) / len(self.cpu_usage_stateless)
        avg_memory_stateful = sum(self.memory_usage_stateful) / len(self.memory_usage_stateful)
        avg_memory_stateless = sum(self.memory_usage_stateless) / len(self.memory_usage_stateless)

        print("\n*** Performance Comparison Report ***\n")
        print(f"Average Latency (Stateful): {avg_stateful_latency:.6f} seconds")
        print(f"Average Latency (Stateless): {avg_stateless_latency:.6f} seconds")
        print(f"Average Throughput (Stateful): {avg_throughput_stateful:.2f} MB")
        print(f"Average Throughput (Stateless): {avg_throughput_stateless:.2f} MB")
        print(f"Average CPU Usage (Stateful): {avg_cpu_stateful:.2f}%")
        print(f"Average CPU Usage (Stateless): {avg_cpu_stateless:.2f}%")
        print(f"Average Memory Usage (Stateful): {avg_memory_stateful:.2f}%")
        print(f"Average Memory Usage (Stateless): {avg_memory_stateless:.2f}%")

        self.plot_results()  # Plot the results after generating the report

# Main simulation
benchmark = Benchmark()

# Simulate some testing; replace these calls with your actual testing logic
for i in range(10):
    # Simulate stateful and stateless filtering
    benchmark.latency_stateful.append(benchmark.stateful_filtering(benchmark.simulate_packet()))
    benchmark.latency_stateless.append(benchmark.stateless_filtering(benchmark.simulate_packet()))
    
    # Collect throughput, CPU, and memory usage in the same way
    benchmark.throughput_stateful.append(0.97)  # Dummy values; replace with actual calculations
    benchmark.throughput_stateless.append(0.98)
    benchmark.cpu_usage_stateful.append(13.75)  # Dummy values
    benchmark.cpu_usage_stateless.append(12.34)
    benchmark.memory_usage_stateful.append(47.89)  # Dummy values
    benchmark.memory_usage_stateless.append(46.12)

# Generate the report which will include the plots
benchmark.generate_report()

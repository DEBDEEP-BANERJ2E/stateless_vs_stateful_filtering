import json
import pandas as pd
import os
from flask import Flask, jsonify
from flask_cors import CORS
from threading import Thread
import time

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variable to store insights and inferences
insights = {}
inferences = {}

# Function to load the JSON file and recalculate insights
def load_and_calculate():
    global insights, inferences
    with open('benchmark_data.json', 'r') as f:
        data = json.load(f)

    # Convert the data into a pandas DataFrame
    df = pd.DataFrame(data)

    # Step 1: Calculate the Average Latency, Throughput, CPU Usage, and Memory Usage for Both Filtering Methods
    stateful_latency_avg = df['latency_stateful'].mean()
    stateless_latency_avg = df['latency_stateless'].mean()

    stateful_throughput_avg = df['throughput_stateful'].mean()
    stateless_throughput_avg = df['throughput_stateless'].mean()

    stateful_cpu_avg = df['cpu_usage_stateful'].mean()
    stateless_cpu_avg = df['cpu_usage_stateless'].mean()

    stateful_memory_avg = df['memory_usage_stateful'].mean()
    stateless_memory_avg = df['memory_usage_stateless'].mean()

    # Step 2: Calculate Percentage Differences
    latency_percentage_diff = ((stateful_latency_avg - stateless_latency_avg) / stateless_latency_avg) * 100
    throughput_percentage_diff = ((stateless_throughput_avg - stateful_throughput_avg) / stateful_throughput_avg) * 100
    cpu_percentage_diff = ((stateful_cpu_avg - stateless_cpu_avg) / stateless_cpu_avg) * 100
    memory_percentage_diff = ((stateful_memory_avg - stateless_memory_avg) / stateless_memory_avg) * 100

    # Step 3: Prepare the Insights
    insights = {
        "Stateful vs Stateless Latency Difference (%)": latency_percentage_diff,
        "Stateful vs Stateless Throughput Difference (%)": throughput_percentage_diff,
        "Stateful vs Stateless CPU Usage Difference (%)": cpu_percentage_diff,
        "Stateful vs Stateless Memory Usage Difference (%)": memory_percentage_diff
    }

    # Step 4: Prepare Inferences based on thresholds
    inferences = {
        "Latency Inference": latency_inference(latency_percentage_diff),
        "Throughput Inference": throughput_inference(throughput_percentage_diff),
        "CPU Usage Inference": cpu_inference(cpu_percentage_diff),
        "Memory Usage Inference": memory_inference(memory_percentage_diff)
    }

# Inference Functions based on percentage differences

def latency_inference(latency_diff):
    if latency_diff > 30:
        return "Stateful filtering method shows extremely high latency compared to stateless, which can severely impact performance and user experience."
    elif latency_diff > 20:
        return "Stateful filtering method shows significantly higher latency compared to stateless, which may impact performance."
    elif latency_diff > 10:
        return "Stateful filtering method shows moderately higher latency compared to stateless, which might cause noticeable delays in processing."
    elif latency_diff > 0:
        return "Stateful filtering method shows slightly higher latency compared to stateless, which might cause minor delays."
    elif latency_diff > -10:
        return "Latency difference between stateful and stateless filtering is minimal and likely has negligible performance impact."
    elif latency_diff > -20:
        return "Stateful filtering method performs moderately better in terms of latency, making it noticeably faster than stateless."
    elif latency_diff > -30:
        return "Stateful filtering method performs significantly better in terms of latency, making it much faster than stateless."
    else:
        return "Stateful filtering method shows extremely low latency compared to stateless, indicating exceptional performance."

def throughput_inference(throughput_diff):
    if throughput_diff > 30:
        return "Stateless filtering method shows extremely high throughput compared to stateful, indicating superior data processing capacity."
    elif throughput_diff > 20:
        return "Stateless filtering method shows significantly higher throughput compared to stateful, indicating better data processing capacity."
    elif throughput_diff > 10:
        return "Stateless filtering method shows moderately higher throughput compared to stateful, leading to noticeably faster data processing."
    elif throughput_diff > 0:
        return "Stateless filtering method performs slightly better in throughput, which could lead to marginally faster data processing."
    elif throughput_diff > -10:
        return "Throughput difference between stateful and stateless filtering is minimal and unlikely to affect performance."
    elif throughput_diff > -20:
        return "Stateful filtering method demonstrates moderately better throughput, suggesting more efficient processing of data."
    elif throughput_diff > -30:
        return "Stateful filtering method demonstrates significantly better throughput, indicating superior efficiency in processing data."
    else:
        return "Stateful filtering method shows extremely high throughput compared to stateless, making it far more efficient."

def cpu_inference(cpu_diff):
    if cpu_diff > 30:
        return "Stateful filtering method shows extremely high CPU usage compared to stateless, which can lead to severe resource inefficiency and potential system strain."
    elif cpu_diff > 20:
        return "Stateful filtering method shows significantly higher CPU usage, which may lead to increased resource consumption and lower efficiency."
    elif cpu_diff > 10:
        return "Stateful filtering method shows moderately higher CPU usage, which might cause noticeable inefficiencies."
    elif cpu_diff > 0:
        return "Stateful filtering method shows slightly higher CPU usage, which might cause minor inefficiencies."
    elif cpu_diff > -10:
        return "CPU usage difference between stateful and stateless filtering is minimal and likely inconsequential."
    elif cpu_diff > -20:
        return "Stateful filtering method uses moderately less CPU, indicating noticeably better resource efficiency compared to stateless."
    elif cpu_diff > -30:
        return "Stateful filtering method uses significantly less CPU, suggesting high resource efficiency."
    else:
        return "Stateful filtering method uses extremely low CPU compared to stateless, indicating outstanding resource efficiency."

def memory_inference(memory_diff):
    if memory_diff > 30:
        return "Stateful filtering method shows extremely high memory usage compared to stateless, which might cause severe memory-related performance issues."
    elif memory_diff > 20:
        return "Stateful filtering method shows significantly higher memory usage, which might cause memory-related performance issues."
    elif memory_diff > 10:
        return "Stateful filtering method uses moderately more memory, which could lead to noticeable inefficiencies."
    elif memory_diff > 0:
        return "Stateful filtering method uses slightly more memory, which could lead to minor inefficiencies."
    elif memory_diff > -10:
        return "Memory usage difference between stateful and stateless filtering is minimal and unlikely to affect performance."
    elif memory_diff > -20:
        return "Stateful filtering method uses moderately less memory, making it noticeably more memory-efficient compared to stateless."
    elif memory_diff > -30:
        return "Stateful filtering method uses significantly less memory, suggesting high memory efficiency."
    else:
        return "Stateful filtering method uses extremely low memory compared to stateless, indicating exceptional memory efficiency."


# File monitoring thread that watches for changes to the JSON file
def monitor_file_changes():
    last_modified_time = os.path.getmtime('benchmark_data.json')
    while True:
        time.sleep(1)  # Check every second
        current_modified_time = os.path.getmtime('benchmark_data.json')
        if current_modified_time != last_modified_time:
            print("File changed, recalculating insights...")
            load_and_calculate()
            last_modified_time = current_modified_time

# Start the file monitoring in a separate thread
thread = Thread(target=monitor_file_changes, daemon=True)
thread.start()

# Step 5: Define a route to return insights and inferences as JSON
@app.route('/api/insights', methods=['GET'])
def get_insights():
    return jsonify({"insights": insights, "inferences": inferences})

# Step 6: Run the Flask app
if __name__ == '__main__':
    # Initial calculation
    load_and_calculate()
    app.run(port=8006)

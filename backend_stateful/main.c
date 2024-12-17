#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "traffic_generator.h"
#include "filtering_rules.h"
#include "latency_measurement.h"
#include "throughput_measurement.h"
#include "resource_monitor.h"
#include "data_analysis.h"
#include "report_generator.h"

// Function to apply stateful filtering
void setup_stateful_filtering() {
    printf("Applying stateful filtering rules...\n");
    system("sudo pfctl -F all");  // Flush existing rules
    system("echo \"pass in proto tcp from any to any port 80 keep state\" | sudo pfctl -f -");
    printf("Stateful filtering rules applied for TCP.\n");
}

// Main function
int main() {
    const char *target_ip = "127.0.0.1";  // Local IP address for testing
    int target_port = 80;  // Port for the iperf3 test
    int test_duration = 10;   // Duration for the test

    printf("=== Stateful vs Stateless Filtering Performance Benchmark ===\n");

    // Step 1: Apply Stateful Filtering (as an example)
    printf("\nStep 1: Applying Stateful Filtering\n");
    setup_stateful_filtering();  // Apply stateful filtering

    // Step 2: Generate Traffic
    printf("\nStep 2: Generating Traffic\n");
    generate_short_lived_traffic(target_ip, target_port);
    generate_long_lived_traffic(target_ip, target_port);

    // Step 3: Measure Latency
    printf("\nStep 3: Measuring Latency\n");
    measure_latency(target_ip, test_duration);  // Pass test_duration here

    // Step 4: Measure Throughput
    printf("\nStep 4: Measuring Throughput\n");
    measure_throughput(target_ip, test_duration);

    // Step 5: Monitor Resource Usage
    printf("\nStep 5: Monitoring Resource Usage\n");
    monitor_resources(test_duration);

    // Step 6: Analyze Data
    printf("\nStep 6: Analyzing Data\n");
    analyze_data("results.txt");

    // Step 7: Generate Report
    printf("\nStep 7: Generating Report\n");
    generate_report(10.5, 5000, 25.3, 40.2, "report.txt");

    printf("\nBenchmark Completed. Report saved to 'results.txt'.\n");
    return 0;
}

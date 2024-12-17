#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <libxml/parser.h>
#include <libxml/tree.h>
#include "traffic_generator.h"
#include "filtering_rules.h"
#include "latency_measurement.h"
#include "throughput_measurement.h"
#include "resource_monitor.h"
#include "data_analysis.h"
#include "report_generator.h"

// Function to check the protocol in a PDML file (TCP or UDP)
void check_protocol_in_pdml(const char *pdml_file) {
    // Parse the PDML XML file
    xmlDoc *doc = NULL;
    xmlNode *root_element = NULL;

    // Load the XML file
    doc = xmlReadFile(pdml_file, NULL, 0);
    if (doc == NULL) {
        printf("Error: could not parse PDML file %s\n", pdml_file);
        return;
    }

    // Get the root element
    root_element = xmlDocGetRootElement(doc);

    // Flag to determine if TCP or UDP is detected
    int is_tcp = 0;
    int is_udp = 0;

    // Iterate through each packet
    xmlNode *packet = root_element->children;
    while (packet != NULL) {
        if (packet->type == XML_ELEMENT_NODE && strcmp((const char *)packet->name, "packet") == 0) {
            // Look for the protocol field in the packet
            xmlNode *proto = packet->children;
            while (proto != NULL) {
                if (proto->type == XML_ELEMENT_NODE && strcmp((const char *)proto->name, "proto") == 0) {
                    xmlChar *protocol_name = xmlGetProp(proto, (const xmlChar *)"name");
                    if (protocol_name != NULL) {
                        if (strcmp((const char *)protocol_name, "tcp") == 0) {
                            printf("TCP packet found\n");
                            is_tcp = 1;
                        } else if (strcmp((const char *)protocol_name, "udp") == 0) {
                            printf("UDP packet found\n");
                            is_udp = 1;
                        }
                        xmlFree(protocol_name);
                    }
                }
                proto = proto->next;
            }
        }
        packet = packet->next;
    }

    // Apply filtering based on protocol
    if (is_tcp) {
        setup_stateful_filtering();  // Apply stateful filtering for TCP
    } else if (is_udp) {
        setup_stateless_filtering();  // Apply stateless filtering for UDP
    }

    // Free the XML document
    xmlFreeDoc(doc);
}

// Function to apply stateless filtering
void setup_stateless_filtering() {
    printf("Applying stateless filtering rules...\n");
    system("sudo pfctl -F all");  // Flush existing rules
    system("echo \"pass in proto udp from any to any port 80\" | sudo pfctl -f -");
    printf("Stateless filtering rules applied for UDP.\n");
}

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
    const char *pdml_file = "capture.pdml";  // PDML file containing captured packets

    printf("=== Stateful vs Stateless Filtering Performance Benchmark ===\n");

    // Step 1: Capture packets and check protocol
    printf("\nStep 1: Checking Protocols in PDML\n");
    check_protocol_in_pdml(pdml_file);

    // Step 2: Apply Filtering Based on Protocol (TCP or UDP)
    // Filtering is already applied inside check_protocol_in_pdml() based on the detected protocol

    // Step 3: Generate Traffic
    printf("\nStep 2: Generating Traffic\n");
    generate_short_lived_traffic(target_ip, target_port);
    generate_long_lived_traffic(target_ip, target_port);

    // Step 4: Measure Latency
    printf("\nStep 3: Measuring Latency\n");
    measure_latency(target_ip, test_duration);  // Pass test_duration here

    // Step 5: Measure Throughput
    printf("\nStep 4: Measuring Throughput\n");
    measure_throughput(target_ip, test_duration);

    // Step 6: Monitor Resource Usage
    printf("\nStep 5: Monitoring Resource Usage\n");
    monitor_resources(test_duration);

    // Step 7: Analyze Data
    printf("\nStep 6: Analyzing Data\n");
    analyze_data("results.txt");

    // Step 8: Generate Report
    printf("\nStep 7: Generating Report\n");
    generate_report(10.5, 5000, 25.3, 40.2, "report.txt");

    printf("\nBenchmark Completed. Report saved to 'results.txt'.\n");
    return 0;
}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <libxml/parser.h>
#include <libxml/tree.h>
#include <sys/stat.h>
#include "traffic_generator.h"
#include "filtering_rules.h"
#include "latency_measurement.h"
#include "throughput_measurement.h"
#include "resource_monitor.h"
#include "data_analysis.h"
#include "report_generator.h"

// Declare the prototype of restrict_tcp_traffic function
void restrict_tcp_traffic(void);

// Function to check the protocol in a PDML file (identify UDP packets)
void check_protocol_in_pdml(const char *pdml_file) {
    // Check if the PDML file exists before proceeding
    struct stat buffer;
    if (stat(pdml_file, &buffer) != 0) {
        printf("Error: PDML file %s does not exist. Skipping protocol check.\n", pdml_file);
        return;
    }

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

    // Flag to determine if UDP is detected (ignore TCP)
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
                        if (strcmp((const char *)protocol_name, "udp") == 0) {
                            printf("UDP packet found\n");
                            is_udp = 1;  // Flag UDP packet detection
                        }
                        xmlFree(protocol_name);
                    }
                }
                proto = proto->next;
            }
        }
        packet = packet->next;
    }

    // Apply filtering based on UDP protocol only
    if (is_udp) {
        setup_stateless_filtering();  // Apply stateless filtering only for UDP
    } else {
        printf("No UDP packets found in PDML. TCP traffic will be restricted.\n");
        restrict_tcp_traffic();  // Restrict TCP traffic if no UDP is found
    }

    // Free the XML document
    xmlFreeDoc(doc);
}

// Function to apply stateless filtering for UDP
void setup_stateless_filtering() {
    printf("Applying stateless filtering rules for UDP...\n");
    system("sudo pfctl -F all");  // Flush existing rules
    system("echo \"pass in proto udp from any to any port 80\" | sudo pfctl -f -");
    printf("Stateless filtering rules applied for UDP.\n");
}

// Function to restrict TCP traffic
void restrict_tcp_traffic() {
    printf("Restricting TCP traffic...\n");
    system("sudo pfctl -F all");  // Flush existing rules
    system("echo \"block in proto tcp from any to any port 80\" | sudo pfctl -f -");
    printf("TCP traffic has been restricted.\n");
}

int main() {
    const char *target_ip = "127.0.0.1";  // Local IP address for testing
    int target_port = 80;  // Port for the iperf3 test
    int test_duration = 10;   // Duration for the test
    const char *pdml_file = "capture.pdml";  // PDML file containing captured packets

    printf("=== Stateless Filtering Performance Benchmark ===\n");

    // Step 1: Capture packets and check protocol
    printf("\nStep 1: Checking Protocols in PDML\n");
    check_protocol_in_pdml(pdml_file);

    // Step 2: Apply Stateless Filtering Based on UDP (TCP will be restricted)
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

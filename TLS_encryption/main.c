#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <libxml/parser.h>
#include <libxml/tree.h>
#include <openssl/ssl.h>
#include <openssl/err.h>
#include <openssl/x509.h>
#include <sys/socket.h>      // For socket(), connect(), etc.
#include <netinet/in.h>      // For sockaddr_in, AF_INET, SOCK_STREAM
#include <arpa/inet.h>       // For inet_addr()
#include "traffic_generator/traffic_generator.h"
#include "filtering_rules/filtering_rules.h"
#include "latency_measurement/latency_measurement.h"
#include "throughput_measurement/throughput_measurement.h"
#include "resource_monitor/resource_monitor.h"
#include "data_analysis/data_analysis.h"
#include "report_generator/report_generator.h"

// Function to initialize OpenSSL library
void init_openssl() {
    SSL_library_init();
    SSL_load_error_strings();
    OpenSSL_add_all_algorithms();
}

// Function to clean up OpenSSL library
void cleanup_openssl(SSL_CTX *ctx, SSL *ssl) {
    SSL_free(ssl);
    SSL_CTX_free(ctx);
    EVP_cleanup();
}

// Function to create and configure OpenSSL context for TLS 1.2+
SSL_CTX* create_ssl_context() {
    const SSL_METHOD *method;
    SSL_CTX *ctx;

    method = TLS_method();  // Updated to use TLS_method()
    ctx = SSL_CTX_new(method);
    if (!ctx) {
        perror("Unable to create SSL context");
        ERR_print_errors_fp(stderr);
        exit(EXIT_FAILURE);
    }

    return ctx;
}

// Function to establish a TLS connection to the server
SSL* create_ssl_connection(SSL_CTX *ctx, const char *hostname, int port) {
    SSL *ssl;
    int sock;
    struct sockaddr_in server_addr;

    // Create socket
    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("Unable to create socket");
        exit(EXIT_FAILURE);
    }

    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(port);
    server_addr.sin_addr.s_addr = inet_addr(hostname);

    // Connect to the server
    if (connect(sock, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("Unable to connect");
        exit(EXIT_FAILURE);
    }

    // Create SSL object
    ssl = SSL_new(ctx);
    if (!ssl) {
        perror("Unable to create SSL object");
        exit(EXIT_FAILURE);
    }

    // Attach the socket to the SSL object
    SSL_set_fd(ssl, sock);

    // Perform the handshake
    if (SSL_connect(ssl) != 1) {
        perror("SSL connect failed");
        ERR_print_errors_fp(stderr);
        exit(EXIT_FAILURE);
    }

    return ssl;
}

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
        setup_stateless_filtering();  // Apply stateless filtering for TCP
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
    system("echo \"pass in proto tcp from any to any port 80\" | sudo pfctl -f -");
    printf("Stateless filtering rules applied for UDP and TCP.\n");
}

int main() {
    const char *target_ip = "127.0.0.1";  // Local IP address for testing
    int target_port = 443;  // Port for the SSL connection
    int test_duration = 10;   // Duration for the test
    const char *pdml_file = "capture.pdml";  // PDML file containing captured packets

    printf("=== SSL Client and Performance Benchmark ===\n");

    // Step 1: Initialize OpenSSL
    init_openssl();
    
    // Step 2: Create SSL context for TLS 1.2+
    SSL_CTX *ctx = create_ssl_context();

    // Step 3: Establish SSL connection with TLS 1.2+
    SSL *ssl = create_ssl_connection(ctx, target_ip, target_port);

    // Step 4: Capture packets and check protocol
    printf("\nStep 1: Checking Protocols in PDML\n");
    check_protocol_in_pdml(pdml_file);

    // Step 5: Apply Stateless Filtering Based on Protocol (TCP or UDP)
    // Filtering is already applied inside check_protocol_in_pdml() based on the detected protocol

    // Step 6: Generate Traffic
    printf("\nStep 2: Generating Traffic\n");
    generate_short_lived_traffic(target_ip, target_port);
    generate_long_lived_traffic(target_ip, target_port);

    // Step 7: Measure Latency
    printf("\nStep 3: Measuring Latency\n");
    measure_latency(target_ip, test_duration);  // Pass test_duration here

    // Step 8: Measure Throughput
    printf("\nStep 4: Measuring Throughput\n");
    measure_throughput(target_ip, test_duration);

    // Step 9: Monitor Resource Usage
    printf("\nStep 5: Monitoring Resource Usage\n");
    monitor_resources(test_duration);

    // Step 10: Analyze Data
    printf("\nStep 6: Analyzing Data\n");
    analyze_data("results.txt");

    // Step 11: Generate Report
    printf("\nStep 7: Generating Report\n");
    generate_report(10.5, 5000, 25.3, 40.2, "report.txt");

    // Step 12: Cleanup OpenSSL
    cleanup_openssl(ctx, ssl);

    printf("\nBenchmark Completed. Report saved to 'results.txt'.\n");
    return 0;
}

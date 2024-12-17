#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <string.h>  // Include this header for strlen
#include "traffic_generator.h"

#define SHORT_LIVED_COUNT 10
#define LONG_LIVED_DURATION 3

void generate_short_lived_traffic(const char *target_ip, int target_port) {
    printf("Generating %d short-lived UDP packets to %s:%d...\n", SHORT_LIVED_COUNT, target_ip, target_port);

    for (int i = 0; i < SHORT_LIVED_COUNT; i++) {
        int sock = socket(AF_INET, SOCK_DGRAM, 0);
        if (sock < 0) {
            perror("Socket creation failed");
            continue;
        }

        struct sockaddr_in server;
        server.sin_family = AF_INET;
        server.sin_port = htons(target_port);
        inet_pton(AF_INET, target_ip, &server.sin_addr);

        // Sending a simple UDP packet
        const char *message = "Short-lived UDP packet";
        ssize_t sent_bytes = sendto(sock, message, strlen(message), 0, (struct sockaddr *)&server, sizeof(server));
        if (sent_bytes < 0) {
            perror("UDP send failed");
        } else {
            printf("Sent packet %d\n", i + 1);
        }
        
        close(sock);
        usleep(10000); // 10ms delay
    }
}

void generate_long_lived_traffic(const char *target_ip, int target_port) {
    printf("Generating a long-lived UDP stream to %s:%d...\n", target_ip, target_port);

    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 0) {
        perror("Socket creation failed");
        return;
    }

    struct sockaddr_in server;
    server.sin_family = AF_INET;
    server.sin_port = htons(target_port);
    inet_pton(AF_INET, target_ip, &server.sin_addr);

    // Sending a long-lived UDP stream
    const char *message = "Long-lived UDP packet stream";
    for (int i = 0; i < LONG_LIVED_DURATION * 10; i++) { // Sending packets for the specified duration
        ssize_t sent_bytes = sendto(sock, message, strlen(message), 0, (struct sockaddr *)&server, sizeof(server));
        if (sent_bytes < 0) {
            perror("UDP send failed");
        }
        usleep(100000); // 100ms delay between packets
    }

    printf("Long-lived UDP stream sent for %d seconds\n", LONG_LIVED_DURATION);
    
    close(sock);
}

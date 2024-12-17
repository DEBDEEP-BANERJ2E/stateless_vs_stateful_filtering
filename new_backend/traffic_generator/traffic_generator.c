#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include "traffic_generator.h"

#define SHORT_LIVED_COUNT 10
#define LONG_LIVED_DURATION 3

void generate_short_lived_traffic(const char *target_ip, int target_port) {
    printf("Generating %d short-lived TCP connections to %s:%d...\n", SHORT_LIVED_COUNT, target_ip, target_port);

    for (int i = 0; i < SHORT_LIVED_COUNT; i++) {
        int sock = socket(AF_INET, SOCK_STREAM, 0);
        if (sock < 0) {
            perror("Socket creation failed");
            continue;
        }

        // Set a 1-second timeout for the connection
        struct timeval timeout;
        timeout.tv_sec = 1; // 1 second
        timeout.tv_usec = 0;
        setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout));
        setsockopt(sock, SOL_SOCKET, SO_SNDTIMEO, &timeout, sizeof(timeout));

        struct sockaddr_in server;
        server.sin_family = AF_INET;
        server.sin_port = htons(target_port);
        inet_pton(AF_INET, target_ip, &server.sin_addr);

        if (connect(sock, (struct sockaddr *)&server, sizeof(server)) == 0) {
            printf("Connection %d successful\n", i + 1);
        } else {
            perror("Connection failed");
        }
        close(sock);
        usleep(10000); // 10ms delay
    }
}

void generate_long_lived_traffic(const char *target_ip, int target_port) {
    printf("Generating a long-lived TCP connection to %s:%d...\n", target_ip, target_port);

    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("Socket creation failed");
        return;
    }

    // Set a 1-second timeout for the connection
    struct timeval timeout;
    timeout.tv_sec = 1; // 1 second
    timeout.tv_usec = 0;
    setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout));
    setsockopt(sock, SOL_SOCKET, SO_SNDTIMEO, &timeout, sizeof(timeout));

    struct sockaddr_in server;
    server.sin_family = AF_INET;
    server.sin_port = htons(target_port);
    inet_pton(AF_INET, target_ip, &server.sin_addr);

    if (connect(sock, (struct sockaddr *)&server, sizeof(server)) == 0) {
        printf("Connection established. Holding for %d seconds...\n", LONG_LIVED_DURATION);
        sleep(LONG_LIVED_DURATION);
    } else {
        perror("Connection failed");
    }
    close(sock);
}

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void measure_throughput(const char *target_ip, int duration) {
    printf("Measuring UDP throughput to %s for %d seconds...\n", target_ip, duration);

    // Run the iperf3 command for UDP and capture the output in a human-readable format
    char command[512];
    snprintf(command, sizeof(command), "iperf3 -c %s -p 80 -u -t %d -f m -b 1G > results.txt", target_ip, duration);
    
    // Execute the command and write the result to results.txt
    int ret = system(command);
    if (ret != 0) {
        printf("Error executing iperf3 command.\n");
        return;
    }

    printf("UDP throughput measurement completed.\n");
}

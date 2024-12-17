#include <stdio.h>
#include <stdlib.h>
#include "latency_measurement.h"

void measure_latency(const char *target_ip, int test_duration) {
    char command[100];
    printf("Measuring latency to %s for %d seconds...\n", target_ip, test_duration);
    snprintf(command, sizeof(command), "ping -c %d %s", test_duration, target_ip);
    system(command);
}

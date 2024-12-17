#include <stdio.h>
#include "report_generator.h"

void generate_report(float latency, float throughput, float cpu, float memory, const char *output_file) {
    FILE *file = fopen(output_file, "w");
    if (!file) {
        perror("Error opening file");
        return;
    }

    fprintf(file, "Stateful vs Stateless Filtering Performance Report\n");
    fprintf(file, "Latency: %.2f ms\n", latency);
    fprintf(file, "Throughput: %.2f packets/second\n", throughput);
    fprintf(file, "CPU Usage: %.2f%%\n", cpu);
    fprintf(file, "Memory Usage: %.2f%%\n", memory);

    fclose(file);
    printf("Report saved to %s\n", output_file);
}

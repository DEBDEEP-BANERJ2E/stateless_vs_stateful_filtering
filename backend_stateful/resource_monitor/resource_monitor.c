#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void monitor_resources(int duration) {
    printf("Monitoring resources for %d seconds...\n", duration);

    // Open the files in write mode at the beginning to clear previous data
    FILE *cpu_file = fopen("cpu_usage.txt", "w");
    if (cpu_file == NULL) {
        printf("Error opening cpu_usage.txt\n");
        return;
    }
    fclose(cpu_file);

    FILE *memory_file = fopen("memory_usage.txt", "w");
    if (memory_file == NULL) {
        printf("Error opening memory_usage.txt\n");
        return;
    }
    fclose(memory_file);

    // Loop to collect data for the specified duration
    for (int i = 0; i < duration; i++) {
        printf("\nTime: %d seconds\n", i + 1);

        // Capture CPU usage and append it to cpu_usage.txt
        FILE *cpu_usage = popen("ps aux | awk 'NR > 1 {print $3}' | head -n 1", "r");
        if (cpu_usage) {
            cpu_file = fopen("cpu_usage.txt", "a");  // Re-open in append mode for each iteration
            if (cpu_file) {
                char data[256];
                while (fgets(data, sizeof(data), cpu_usage)) {
                    fprintf(cpu_file, "%s", data);  // Write CPU usage to the file
                }
                fclose(cpu_file);
            } else {
                printf("Error opening cpu_usage.txt in append mode\n");
            }
            pclose(cpu_usage);  // Use pclose for commands run with popen
        } else {
            printf("Error retrieving CPU usage\n");
        }

        // Capture memory usage and append it to memory_usage.txt
        FILE *memory_usage = popen("vm_stat | grep 'Pages free' | awk '{print $3}'", "r");
        if (memory_usage) {
            memory_file = fopen("memory_usage.txt", "a");  // Re-open in append mode for each iteration
            if (memory_file) {
                char data[256];
                while (fgets(data, sizeof(data), memory_usage)) {
                    fprintf(memory_file, "%s", data);  // Write memory usage to the file
                }
                fclose(memory_file);
            } else {
                printf("Error opening memory_usage.txt in append mode\n");
            }
            pclose(memory_usage);  // Use pclose for commands run with popen
        } else {
            printf("Error retrieving memory usage\n");
        }

        sleep(1);  // Wait for 1 second before checking again
    }
}
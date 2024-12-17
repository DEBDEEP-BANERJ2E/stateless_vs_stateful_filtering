#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void analyze_data(const char *file_name) {
    printf("Analyzing data from %s...\n", file_name);

    // Open the results.txt file to read data
    FILE *file = fopen(file_name, "r");
    if (!file) {
        perror("Error opening file");
        return;  // Exit if the file does not exist
    }
    
    char line[256];
    int interval_count = 0;
    double total_bitrate = 0.0;
    double average_bitrate = 0.0;

    // Loop through each line of the file
    while (fgets(line, sizeof(line), file)) {
        // Search for lines containing bitrate data (e.g., " 104729 Mbits/sec")
        if (strstr(line, "Mbits/sec")) {
            char *bitrate_str = strstr(line, "Mbits/sec");
            if (bitrate_str) {
                // Extract the bitrate value from the line
                char bitrate_value[50];
                sscanf(bitrate_str - 20, "%s", bitrate_value);

                // Convert the bitrate value to double
                double bitrate = atof(bitrate_value);
                printf("Interval: %s Bitrate: %lf Mbits/sec\n", line, bitrate);

                // Accumulate the bitrate to calculate the average
                total_bitrate += bitrate;
                interval_count++;
            }
        }
    }

    if (interval_count > 0) {
        // Calculate average bitrate
        average_bitrate = total_bitrate / interval_count;
        printf("Average bitrate over %d intervals: %.2lf Mbits/sec\n", interval_count, average_bitrate);
    } else {
        printf("No bitrate data found in the file.\n");
    }

    fclose(file);
    printf("Data analysis complete.\n");
}

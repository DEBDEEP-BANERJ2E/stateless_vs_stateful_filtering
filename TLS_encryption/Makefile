# Compiler options
CC = gcc
CFLAGS = -Wall -g -I./traffic_generator -I./filtering_rules -I./latency_measurement -I./throughput_measurement -I./resource_monitor -I./data_analysis -I./report_generator -I/opt/homebrew/opt/openssl@3/include -I/opt/homebrew/opt/libxml2/include
LDFLAGS = -L/opt/homebrew/opt/openssl@3/lib -lssl -lcrypto -L/opt/homebrew/opt/libxml2/lib -lxml2

# Object files
OBJS = main.o ssl_client.o traffic_generator.o filtering_rules.o latency_measurement.o throughput_measurement.o resource_monitor.o report_generator.o

# Target for building the final executable
all: main

# Rule to create the executable 'main'
main: $(OBJS)
	$(CC) $(OBJS) -L/opt/homebrew/opt/openssl@3/lib -lssl -lcrypto -L/opt/homebrew/opt/libxml2/lib -lxml2 -o main

# Rule for compiling main.c
main.o: main.c
	$(CC) $(CFLAGS) -c main.c

# Rule for compiling ssl_client.c
ssl_client.o: ssl_client.c
	$(CC) $(CFLAGS) -c ssl_client.c

# Rule for compiling traffic_generator.c
traffic_generator.o: traffic_generator/traffic_generator.c
	$(CC) $(CFLAGS) -c traffic_generator/traffic_generator.c

# Rule for compiling filtering_rules.c
filtering_rules.o: filtering_rules/filtering_rules.c
	$(CC) $(CFLAGS) -c filtering_rules/filtering_rules.c

# Rule for compiling latency_measurement.c
latency_measurement.o: latency_measurement/latency_measurement.c
	$(CC) $(CFLAGS) -c latency_measurement/latency_measurement.c

# Rule for compiling throughput_measurement.c
throughput_measurement.o: throughput_measurement/throughput_measurement.c
	$(CC) $(CFLAGS) -c throughput_measurement/throughput_measurement.c

# Rule for compiling resource_monitor.c
resource_monitor.o: resource_monitor/resource_monitor.c
	$(CC) $(CFLAGS) -c resource_monitor/resource_monitor.c

# Rule for compiling report_generator.c
report_generator.o: report_generator/report_generator.c
	$(CC) $(CFLAGS) -c report_generator/report_generator.c

# Directly include data_analysis.c during compilation
main.o: data_analysis/data_analysis.c
	$(CC) $(CFLAGS) -c data_analysis/data_analysis.c

# Clean up object files and executable
clean:
	rm -f *.o main

#!/bin/bash

# Randomly select TCP or UDP for the test
if (( RANDOM % 2 )); then
    PROTOCOL="TCP"
else
    PROTOCOL="UDP"
fi

echo "Selected Protocol: $PROTOCOL"

# Start iperf3 in the background with the selected protocol
if [ "$PROTOCOL" == "TCP" ]; then
    iperf3 -c 127.0.0.1 -t 60 -i 1 > iperf_output.txt &
elif [ "$PROTOCOL" == "UDP" ]; then
    iperf3 -c 127.0.0.1 -u -t 60 -i 1 > iperf_output.txt &
fi

# Capture the process ID of iperf3
IPERF_PID=$!

# Capture system stats (CPU, Memory, etc.) during the test
while ps -p $IPERF_PID > /dev/null; do
    # Get average CPU usage and memory usage
    top -l 1 -pid $IPERF_PID | grep "CPU" | grep "Memory" >> system_stats.txt
    sleep 1
done

# After iperf3 completes, gather the iperf3 results
cat iperf_output.txt

echo "System stats captured during the test:"
cat system_stats.txt


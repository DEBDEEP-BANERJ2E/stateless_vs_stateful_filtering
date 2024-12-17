#ifndef TRAFFIC_GENERATOR_H
#define TRAFFIC_GENERATOR_H

void generate_short_lived_traffic(const char *target_ip, int target_port);
void generate_long_lived_traffic(const char *target_ip, int target_port);

#endif

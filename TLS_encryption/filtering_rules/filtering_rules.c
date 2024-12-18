// #include <stdio.h>
// #include <stdlib.h>
// #include "filtering_rules.h"

// void setup_stateless_filtering() {
//     printf("Applying stateless filtering rules...\n");
//     system("sudo pfctl -F all");  // Flush existing rules
//     system("echo \"pass in proto tcp from any to any port 80\" | sudo pfctl -f -");
//     printf("Stateless filtering rules applied.\n");
// }

// void setup_stateful_filtering() {
//     printf("Applying stateful filtering rules...\n");
//     system("sudo pfctl -F all");  // Flush existing rules
//     system("echo \"pass in proto tcp from any to any port 80 keep state\" | sudo pfctl -f -");
//     printf("Stateful filtering rules applied.\n");
// }

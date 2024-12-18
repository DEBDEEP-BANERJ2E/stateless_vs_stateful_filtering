#include <openssl/ssl.h>
#include <openssl/err.h>
#include <openssl/evp.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netdb.h>

// Function to open a socket connection to a specified hostname and port
int open_connection(const char *hostname, const char *port) {
    struct sockaddr_in addr;
    struct hostent *host;
    int sockfd;

    // Get the IP address of the hostname
    host = gethostbyname(hostname);
    if (!host) {
        perror("gethostbyname failed");
        return -1;
    }

    // Create the socket
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        perror("socket failed");
        return -1;
    }

    // Set up the sockaddr_in structure
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(atoi(port));
    memcpy(&addr.sin_addr.s_addr, host->h_addr_list[0], host->h_length);

    // Connect to the server
    if (connect(sockfd, (struct sockaddr *)&addr, sizeof(addr)) < 0) {
        perror("connect failed");
        close(sockfd);
        return -1;
    }

    return sockfd;
}

int main() {
    SSL_CTX *ctx;
    SSL *ssl;
    int server;
    const char *hostname = "localhost";
    const char *portnum = "4433";

    // Initialize OpenSSL
    SSL_library_init();
    SSL_load_error_strings();
    OpenSSL_add_all_algorithms();

    // Create a new SSL context
    ctx = SSL_CTX_new(SSLv23_client_method());
    if (!ctx) {
        perror("SSL_CTX_new failed");
        return -1;
    }

    // Disable certificate verification (this bypasses SSL verification)
    SSL_CTX_set_verify(ctx, SSL_VERIFY_NONE, NULL);

    // Create a new SSL structure
    ssl = SSL_new(ctx);
    if (!ssl) {
        perror("SSL_new failed");
        return -1;
    }

    // Create a socket and connect to the server
    server = open_connection(hostname, portnum);
    if (server < 0) {
        perror("open_connection failed");
        return -1;
    }

    SSL_set_fd(ssl, server);

    // Perform the SSL handshake
    if (SSL_connect(ssl) == -1) {
        perror("SSL_connect failed");
        return -1;
    }

    printf("Connected to %s:%s with cipher %s\n", hostname, portnum, SSL_get_cipher(ssl));

    // Send a simple request
    SSL_write(ssl, "GET / HTTP/1.1\r\n\r\n", strlen("GET / HTTP/1.1\r\n\r\n"));

    // Read the response
    char buffer[1024];
    int bytes;
    while ((bytes = SSL_read(ssl, buffer, sizeof(buffer))) > 0) {
        fwrite(buffer, 1, bytes, stdout);
    }

    // Clean up
    SSL_free(ssl);
    close(server);
    SSL_CTX_free(ctx);
    return 0;
}

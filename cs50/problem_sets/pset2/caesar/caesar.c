#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include <cs50.h>

int main(int argc, string args[])
{
    if (argc != 2)
    {
        printf("How to use: ./caesar k");
    }
    int k = atoi(args[1]) % 26;
    string plaintext = get_string("plain text: ");
    int plaintext_length = strlen(plaintext);
    char ciphertext[plaintext_length];

    for (int i = 0; i < plaintext_length; i++)
    {
        if (isspace(plaintext[i]) || !isalpha(plaintext[i]))
        {
            ciphertext[i] = plaintext[i];
            // continue through the loop without performing any lower operations
            continue;
        }
        // Positions for both lower and upper chars on ASCII table
        int offset = isupper(plaintext[i]) ? 65 : 97;
        int plain_ascii_code = plaintext[i] - offset;
        int cipher_ascii_code = ((plain_ascii_code + k) % 26) + offset;
        ciphertext[i] = cipher_ascii_code;
    }

    printf("cipher text: %s\n", ciphertext);
    return 0;
}
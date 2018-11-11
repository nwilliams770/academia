#define _XOPEN_SOURCE
#include <unistd.h>
#include <stdio.h>
#include <string.h>
#include <cs50.h>

// anushree:50xcIMJ0y.RXo YES
// brian:50mjprEcqC/ts    CA
// bjbrown:50GApilQSG3E2  UPenn
// lloyd:50n0AAUD.pL8g    lloyd
// malan:50CcfIk1QrPr6    maybe
// maria:509nVI8B9VfuA    TF
// natmelo:50JIIyhDORqMU  nope
// rob:50JGnXUgaafgc      ROFL
// stelios:51u8F0dkeDSbY  NO
// zamyla:50cI2vYkF0YU2   LOL

int main (int argc, string argv[])
{
    if (argc != 2)
    {
        printf("How to use: ./crack <hash>");
        return 1;
    }

    // Extract hash from args
    string hash = argv[1];

    // Define salt and extract from hash
    // Is adding \0 even necessary for salt?
    char salt[3];
    memcpy(salt, hash, 3);
    salt[2] = '\0';

    // Makes more sense to leverage ASCII values and iterate through arithmatic as opposed to
    // iterating through a string
    string letters = "\0abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // Why does strlen not work on letters? Had to hard code for functionality
    int letter_count = 55;
    char possible_key[6];

    // The most nested for loop of your life
    for (int fifth = 0; fifth < letter_count; fifth++)
    {
        for (int fourth = 0; fourth < letter_count; fourth++)
        {
            for (int third = 0; third < letter_count; third++)
            {
                for (int second = 0; second < letter_count; second++)
                {
                    for (int first = 0; first < letter_count; first++)
                    {
                        possible_key[0] = letters[first];
                        possible_key[1] = letters[second];
                        possible_key[2] = letters[third];
                        possible_key[3] = letters[fourth];
                        possible_key[4] = letters[fifth];
                        if (strcmp(crypt(possible_key, salt), hash) == 0)
                        {
                            printf("%s\n", possible_key);
                            return 0;
                        }
                    }
                }
            }
        }
    }
    printf("Password couldn't be cracked! You.are.GOOD\n");
    return 2;
}
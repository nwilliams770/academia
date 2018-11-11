#include <stdio.h>
#include <cs50.h>

int main(void)
{
    // Declare our height variable and
    // prompt user for input until we get a number <
    int n;
    do
    {
        n = get_int("Height (max 24): ");
    }
    while (n <= 0 || n > 24);

    // ROW printer
    for (int i = 0; i < n; i++)
    {
        //SPACE printer
        for (int j = 0; j < (n - (i + 1)); j++)
        {
            printf(" ");
        }
        // LEFT PYRAMID PRINTER
        for (int k = 0; k < (i + 1); k++)
        {
            printf("#");
        }
        // GAP printer

        printf("  ");
        // RIGHT PYRAMID PRINTER
        for (int l = 0; l < (i + 1); l++)
        {
            printf("#");
        }

        printf("\n");
    }
}


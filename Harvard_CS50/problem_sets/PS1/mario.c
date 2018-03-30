#include <stdio.h>
#include <cs50.h>

void PrintPyramid(int);

int main(void)
{
    int height;
    do
    {
        printf("height: ");
        scanf("%d", &height);
    }
    while (height < 0 || height > 24);

    PrintPyramid(height);
}

void PrintPyramid(int height)
{
    //print each row
    for (int i = 0; i < height; i++ )
    {
        //print spaces for left pyramid
        for (int k= 0; k < (height - (i + 1)); k++)
        {
            printf(" ");
        }

        //print #'s for left pyramid
        for (int l = 0; l < (i + 1); l++)
        {
            printf("#");
        }

        //print spaces gap
        for (int m = 0; m < 2; m++)
        {
            printf(" ");
        }

        //print right pyramid
        for (int n = 0; n < (i + 1); n++)
        {
            printf("#");
        }

        printf("\n");
    }
}
#include <stdio.h>
#include <stdint.h>
#include <stdbool.h>

#define BLOCK_SIZE 512

typedef uint8_t BYTE;

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        fprintf(stderr, "Usage: recover infile\n");
        return 1;
    }

    // remember infile name
    // char * is just an array of chars; we know arrays are just pointers to the first el
    char *infile = argv[1];

    //open input file
    FILE *inptr = fopen(infile, "r");
    if (inptr == NULL)
    {
        fprintf(stderr, "Could not open %s.\n", infile);
        return 2;
    }

    BYTE buffer[512];
    int image_count = 0;

    char filename[8];
    FILE *outptr = NULL;

    while (true)
    {
        // Read chunk of file
        size_t bytes_read = fread(buffer, sizeof(BYTE), BLOCK_SIZE, inptr);

        // break out of fread returns 0; means no chunks were successfully read
        if (bytes_read == 0 && feof(inptr))
        {
            break;
        }

        bool contains_jpeg_header = buffer[0] == 0xff && buffer[1] == 0xd8 && buffer[2] == 0xff && (buffer[3] & 0xf0) == 0xe0;

        // Have we already been reading JPEGs?
        if (contains_jpeg_header && outptr != NULL)
        {
            fclose(outptr);// if we are, close the old file, iterate image_count
            image_count++;
        }

        //are we at a JPEG? If so, start new file and update our outptr
        if (contains_jpeg_header)
        {
            sprintf(filename, "%03i.jpg", image_count);
            outptr = fopen(filename, "w");
        }

        if (outptr != NULL)
        {
            fwrite(buffer, sizeof(BYTE), bytes_read, outptr);
        }

    }
    // close last opened file
    fclose(outptr);

    // close infile
    fclose(inptr);

    return 0;
}
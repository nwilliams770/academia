// Copies a BMP file

#include <stdio.h>
#include <stdlib.h>

#include "bmp.h"

int main(int argc, char *argv[])
{
    // ensure proper usage
    if (argc != 4)
    {
        fprintf(stderr, "Usage: resize n infile outfile\n");
        return 1;
    }

    // remember filenames
    char *infile = argv[2];
    char *outfile = argv[3];


    // Get size multiplier and convert to float
    float n = atof(argv[1]);
    if (n < 1 || n > 100)
    {
        printf("BMP resizing factor must be a postive integer less than or equal to 100.");
        return 1;
    }
    // open input file
    FILE *inptr = fopen(infile, "r");
    if (inptr == NULL)
    {
        fprintf(stderr, "Could not open %s.\n", infile);
        return 2;
    }

    // open output file
    FILE *outptr = fopen(outfile, "w");
    if (outptr == NULL)
    {
        fclose(inptr);
        fprintf(stderr, "Could not create %s.\n", outfile);
        return 3;
    }


    // read infile's BITMAPFILEHEADER
    BITMAPFILEHEADER bf;
    fread(&bf, sizeof(BITMAPFILEHEADER), 1, inptr);

    // read infile's BITMAPINFOHEADER
    BITMAPINFOHEADER bi;
    fread(&bi, sizeof(BITMAPINFOHEADER), 1, inptr);

    // ensure infile is (likely) a 24-bit uncompressed BMP 4.0
    if (bf.bfType != 0x4d42 || bf.bfOffBits != 54 || bi.biSize != 40 ||
        bi.biBitCount != 24 || bi.biCompression != 0)
    {
        fclose(outptr);
        fclose(inptr);
        fprintf(stderr, "Unsupported file format.\n");
        return 4;
    }

    // Get old image dimensions
    int old_width = bi.biWidth;
    int old_height = bi.biHeight;
    int old_padding = (4 - (bi.biWidth * sizeof(RGBTRIPLE)) % 4) % 4;

    //Update file header width and height and calculate new padding if necessary;
    int new_width = bi.biWidth * n;
    int new_height = bi.biHeight * n;
    bi.biWidth = new_width;
    bi.biHeight = new_height;
    int new_padding =  (4 - (bi.biWidth * sizeof(RGBTRIPLE)) % 4) % 4;

    // Calc new image size
    bi.biSizeImage = ((bi.biWidth * sizeof(RGBTRIPLE)) + new_padding) * abs(bi.biHeight);
    bf.bfSize = bi.biSizeImage + sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);

    // write outfile's BITMAPFILEHEADER
    fwrite(&bf, sizeof(BITMAPFILEHEADER), 1, outptr);

    // write outfile's BITMAPINFOHEADER
    fwrite(&bi, sizeof(BITMAPINFOHEADER), 1, outptr);

// determine ratio
    double widthRatio = (double) old_width / (double) new_width;
    double heightRatio = (double) old_height / (double) new_height;

    // allocate a memory to store one scanline
    RGBTRIPLE scanline[old_width * sizeof(RGBTRIPLE)];
    int cachedScanline = -1;

    // for all rows in the new image
    for (int i = 0, biHeight = abs(new_height); i < biHeight; i++)
    {
        // compute the Y coordinate of the corresponding row in the old image
        int row = i * heightRatio;

        // read the corresponding scanline from the old image unless it's cached
        if (cachedScanline != row)
        {
            fseek(inptr, sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER) + (((sizeof(RGBTRIPLE) * old_width) + old_padding) * row), SEEK_SET);
            fread(scanline, sizeof(RGBTRIPLE), old_width, inptr);
            cachedScanline = row;
        }

        // for all columns in the new image
        for (int j = 0; j < new_width; j++)
        {
            // compute the X coordinate of the corresponding column in the old image
            int column = j * widthRatio;
            fwrite(&scanline[column], sizeof(RGBTRIPLE), 1, outptr);
        }

        // write new padding
        for (int j = 0; j < new_padding; j++)
        {
            fputc(0x00, outptr);
        }
    }

    // // iterate over infile's scanlines
    // for (int i = 0, biHeight = abs(bi.biHeight); i < biHeight; i++)
    // {
    //     // iterate over pixels in scanline
    //     for (int j = 0; j < bi.biWidth; j++)
    //     {
    //         // temporary storage
    //         RGBTRIPLE triple;

    //         // read RGB triple from infile
    //         fread(&triple, sizeof(RGBTRIPLE), 1, inptr);

    //         // write RGB triple to outfile
    //         fwrite(&triple, sizeof(RGBTRIPLE), 1, outptr);
    //     }

    //     // skip over padding, if any
    //     fseek(inptr, padding, SEEK_CUR);

    //     // then add it back (to demonstrate how)
    //     for (int k = 0; k < padding; k++)
    //     {
    //         fputc(0x00, outptr);
    //     }
    // }

    // close infile
    fclose(inptr);

    // close outfile
    fclose(outptr);

    // success
    return 0;
}

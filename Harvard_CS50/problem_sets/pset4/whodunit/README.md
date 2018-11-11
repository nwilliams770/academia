# Questions

## What's `stdint.h`?

stdint.h is a header file that declares specified integer types as having a certain width.

## What's the point of using `uint8_t`, `uint32_t`, `int32_t`, and `uint16_t` in a program?
It makes clear that you intend to use the data a specific way. uint24_t means an integer that is exactly 24 bits wide.
We would't know how to parse it without a specified number width e.g. gives what would be jumbled numbers a meaning

## How many bytes is a `BYTE`, a `DWORD`, a `LONG`, and a `WORD`, respectively?

    BYTE is 1 byte
    DWORD is 4 bytes
    LONG is 4 bytes
    WORD is 2 bytes

## What (in ASCII, decimal, or hexadecimal) must the first two bytes of any BMP file be? Leading bytes used to identify file formats (with high probability) are generally called "magic numbers."
 	The first two bytes of a BMP is a WORD and denotes bfType, which specifies the file type. It must be
 	set to the signature word BM (0x4D42) to indicate bitmap.

## What's the difference between bfSize and biSize?
	bfSize specifies the size, in bytes, of the bitmap file.
	biSize specifies the size of the structure in bytes.

## What does it mean if biHeight is negative?
	If biHeight is positive, the bitmap is a bottom-up DIB (device-independent bitmap)
	and its origin is the lower left corner.

	If biHeight is negative, the bitmap is a top-down DIB (device-independent bitmap)
	and its origin is the upper left corner.

## What field in BITMAPINFOHEADER specifies the BMP's color depth (i.e., bits per pixel)?
	The biBitCount member of the BITMAPINFOHEADER structure determines the number of
	bits that define each pixel and the maximum number of colors in the bitmap.

## Why might fopen return NULL in copy.c:37?
	fopen will return NULL if it cannot create the outfile to write to. I don't know why that might happen.

## Why is the third argument to fread always 1 in our code?
	The program is reading in 1 RGB triple at a time.

## What value does copy.c:70 assign padding if bi.biWidth is 3?
	biWidth is the width of the bitmap in pixels. If the width is 3, padding is necessary since
	the scanline must be a multiple of 4.
	3 pixels * 3 bytes per pixel = 9 bytes. 3 bytes are added to bring the scanline to 12 bytes.
	I don't understand the math, though.

## What does fseek do?
	Skips over any padding and looks for the next RGB triple (pixel)

## what is SEEK_CUR?
	This is an integer constant which, when used as the whence argument to the fseek or fseeko function,
	specifies that the offset provided is relative to the current file position


## Whodunit?
	Professor Plum with the candlestick in the library.

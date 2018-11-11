// Helper functions for music

#include <cs50.h>
#include <string.h>
#include <math.h>

#include "helpers.h"

// Converts a fraction formatted as X/Y to eighths
int duration(string fraction)
{
    // This looks strange but in C, there are no 'strings'
    // There are just arrays of chars, and a char is really just an
    // integer value representing the ending of the letter, number, or symbol
    // The DIGIT characters are mapped in a way that the encoded value for '1'
    // is the encoded for '0' + 1. Using that logic, we can get the int value
    // for SINGLE digit numbers by subtracting '0'.
    int numerator = fraction[0] - '0';
    int denominator = fraction[2] - '0';

    return round(numerator * (8 / denominator));
}

// Calculates frequency (in Hz) of a note
int frequency(string note)
{

    // Base frequency of A4 is 440Hz
    double base_frequency = 440.0;

    switch (note[0])
    {
        case 'A':
            break;
        case 'B':
            base_frequency *= pow(2.0, 2.0 / 12.0);
            break;
        case 'C':
            base_frequency /= pow(2.0, 9.0 / 12.0);
        case 'D':
            base_frequency /= pow(2.0, 7.0 / 12.0);
            break;
        case 'E':
            base_frequency /= pow(2.0, 5.0 / 12.0);
            break;

        case 'F':
            base_frequency /= pow(2.0, 4.0 / 12.0);
            break;
        case 'G':
            base_frequency /= pow(2.0, 2.0 / 12.0);
            break;
    }

    if (octave > 4)
    {
        base_frequency *= pow(2.0, octave - 4);
    }
    else if (octave < 4)
    {
        base_frequency /= pow(2.0, 4 - octave);
    }

    // check if there is accidental
    if (note[1] == 'b')
    {
        base_frequency /= pow(2.0, 1.0 / 12.0);
    }
    else if (note[1] == '#')
    {
    base_frequency *= pow(2.0, 1.0 / 12.0);
    }

    return round(base_frequency);
}

// Determines whether a string represents a rest
bool is_rest(string s)
{
    return strlen(s) == 0;
}

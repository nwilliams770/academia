// Variation of djb2 hash function from https://github.com/mareksuscak/ //

#include "djb2.h"

unsigned long djb2(const void *_str)
{
  const char *str = _str;
  unsigned long hash = 5381;
  int c;

  while ((c = *str++))
  {
    hash = ((hash << 5) + hash) + c; /* hash * 33 + c */
  }

  return hash;
}
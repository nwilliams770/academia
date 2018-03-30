#include <stdio.h>

int main(void)
{
    //get input
    long long credit_card;
    do
    {
        credit_card = get_long_long();
    }
    while (n < 0);

    //OUTPUT
    check_validity(credit_card);
}

check_validity(long long ccn)
{
    int len = length(ccn);
    if (! (checklength(ccn, len) && checksum(ccn,len)) )
    {
        printf("INVALID");
        return;
    }

    print_card_brand(ccn);
}

// @return int length
int length(long long n)
{
    int len = 0;
    while (n > 0)
    {
        len++;
        n /= 10;
    }
    return len;
}

// return false is ccn length is invalid
bool checklength(long long ccn, int len)
{
    if (len == 13 || len == 14 || len == 16)
        return true;
    return false;
}

bool checkSum(long long ccn, int len)
{

}
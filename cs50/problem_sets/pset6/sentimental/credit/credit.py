def credit(card_number):
    vendor_prefix = str(card_number)[0:2]
    every_second_digit = card_number[::2]
    leftover_digits = card_number[1::2]
    sum = 0

    for index in range(len(every_second_digit):
        product = int(every_second_digit[index]) * 2
        while product:
            sum += product % 10
            product //= 10

    for index in range(len(leftover_digits)):
        sum += int(leftover_digits[index])

    if not sum % 10 == 0:
        print("INVALID")
    else:
        if vendor_prefix == "37" or vendor_prefix == "34":
            print("AMEX")
        elif vendor_prefix[0] == "4":
            print("VISA")
        else:
            print("MASTERCARD")
    return 0



import crypt
import sys

def crack(password):
    if len(sys.argv) != 2:
        print("Usage: crack <hash>")
        sys.exit(1)

    hash = sys.argv[1]
    salt = hash[0:2]
    letters = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

    for fifth in letters:
        for fourth in letters:
            for third in letters:
                for second in letters[1:]:
                    password = f"{first}{second}{third}{fourth}{fifth}".strip()

                    if crypt.crypt(password, salt) == hash:
                        print(password)
                        sys.exit(0)

import constant

class Card:
    # RANKS = {'2': (2), '3': (3), '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    #     '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': (1, 11) }

    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank

    def __str__(self):
        return "{}{}".format(self.rank, self.suit)

    # @propery
    # def value(self):
    #     return RANKS[self.rank]
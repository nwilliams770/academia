import random
import constant
from card import Card


class Deck:
    def __init__(self):
        self.deck = []
        for suit in constant.SUITS:
            for rank in constant.RANKS.keys():
                self.deck.append(Card(suit, rank))

    def __str__(self):
        print(f"{len(self.deck)} cards in deck:")
        for card in self.deck:
            print("\t"+card)

    def shuffle(self):
        random.shuffle(self.deck)

    def deal(self):
        try:
            card = self.deck.pop()
            return card
        except IndexError:
            # We'd never run into this case since we instantiate a new deck every game
            # What's a good way tho to handle this if that wasn't the case though?
            # return False?
            print("No cards left in deck!")



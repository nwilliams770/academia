import constant

class Hand:
    def __init__(self):
        self.cards = []
        self.value = 0

    def add_card(self, card):
        self.cards.append(card)

        if self.is_ace(card):
            # self.value = optimized_ace_val
            self._optimize_val_for_ace()
        else:
            self.value += constant.RANKS[card.rank]

    def _optimize_val_for_ace(self):
        # Run whenever an ace is added, agnostic to whether a hand has busted or not
        aces = 0
        optimized_val = 0
        ace_low, ace_high = constant.RANKS["A"]

        # Assume we have aces already in our hand, we don't know if they've been added as 1 or 11
        # So recalc value WITHOUT aces
        for card in self.cards:
            if not self.is_ace(card):
                optimized_val += constant.RANKS[card.rank]
            else:
                aces += 1

        # Then add in optimal ace val for each ace in hand
        for _ in range(0, aces):
            if (optimized_val + ace_high) <= constant.OPTIMAL_VALUE:
                optimized_val += ace_high
            else:
                optimized_val += ace_low
        # return some optimized val
        self.value = optimized_val

    def is_ace(self, card):
        return card.rank == "A"

    def is_busted(self):
        return self.value > constant.OPTIMAL_VALUE
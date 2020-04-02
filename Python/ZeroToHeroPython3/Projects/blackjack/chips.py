class Chips:
    def __init__(self, total=100):
        self.total = total
        self.bet = 0

    def won_bet(self):
        self.total += self.bet * 2
        self.bet = 0

    def lost_bet(self):
        self.bet = 0

    def bankrupt(self):
        return self.total == 0
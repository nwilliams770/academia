# Live in Card class
CLUB = "\u2663"
HEART = "\u2665"
DIAMOND = "\u2666"
SPADE = "\u2660"
SUITS = (CLUB, HEART, DIAMOND, SPADE)
# This should be immutable, better type/way to store this?
    # normalize me, captain
RANKS = {'2': (2), '3': (3), '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
         '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': (1, 11) }

# Part of some Game class
OPTIMAL_VALUE = 21
DEALER_CEILING = 17

# config file kind of thingY? .yaml
MESSAGES = {"player_bust": "Looks like someone needs to practice their card-counting skills, you busted!",
            "player_win": "You're a winner, baby!",
            "dealer_bust": "Well, no one said computers were smart...dealer busts!",
            "dealer_win": "You should've taken more risks, dealer wins!"}
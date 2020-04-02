import constant
import time
from deck import Deck
from hand import Hand
from chips import Chips

class InputError(Exception):
    def __init__(self, message):
        self.message = message

def sanitize(input_bet):
    try:
        bet_as_float = float(input_bet)
        bet_as_int = int(input_bet)
    except ValueError:
        raise InputError("Must be a number")
    if bet_as_float != bet_as_int:
        raise InputError("Must be an integer")
    return bet_as_int

def take_bet(chips):
    # This pattern will prevent a user from putting in non-int or non-float values
    # But how could we limit input so that users only input ints?
    # Currently if user inputs 3.5555, it'll be cast to 3; that's weird UX
    while True:
        try:
            bet = sanitize(input(f"Please place a bet for the next hand, your balance is ${chips.total}\n$"))
            # bet = int(bet)
        except InputError as e:
            print("\nWhoops! {}".format(e.message))
            continue
        if  bet > chips.total:
            print("\nSneaky cat, that bet is more than you can afford.")
            continue
        else:
            break
    print(f"Bet of ${bet} taken. Good luck, chump!\n")

    # chips.place_bet(bet)
    chips.total -= bet
    chips.bet = bet
    # Is it better design to have  some sort of return statement here to provide feedback
    # to confirm if bet went through?

def hit(deck, hand):
    print("Hit!\n")
    hand.add_card(deck.deal())

def hit_or_stand(deck,hand):
    move = get_move()
    if move[0] == "h":
        clear_screen()
        hit(deck, hand)
        return True
    else:
        return False

def get_move():
    # Better way to prompt for a specific input?
    # Also, how could we add some sort of error message if the user doesn't put in a right move?
    while True:
        player_move = input("So what's it gonna be, jolly bee? Hit (H) or Stand (S): ").lower()
        if player_move in ["hit", "h", "stand", "s"]:
            return player_move
        else:
            continue

def show_cards(dealer, player, hiding_dealer):
    # While user plays, dealer has one card hidden
    # When dealer player, all cards showing
    dealer_value = 0
    if hiding_dealer:
        dealer_value = 11 if dealer.is_ace(dealer.cards[1]) else constant.RANKS[dealer.cards[1].rank]
    else:
        dealer_value = dealer.value

    print("Dealer:", end=" ")
    for i, card in enumerate(dealer.cards):
        if hiding_dealer and i == 0:
            print("???", end=" ")
        elif i == len(dealer.cards) - 1:
            print(str(card), end=" | ")
        else:
            print(str(card), end=" ")
    print(f"{dealer_value}\n")

    print("You:", end=" "),
    for card in player.cards:
        print(str(card), end=" ")
    print(f"| {player.value}\n")

def end_round(message, player_won, chips):
    print(f"{constant.MESSAGES[message]}")

    if player_won:
        chips.won_bet()
    else:
        chips.lost_bet()
    print(f"\nYour new balance is ${chips.total}\n")

def replay():
    replay = input("Would you like to go another round, cowboy? Y / N : ")
    clear_screen()
    if (non_yes_response(replay)):
        print("Prudent move, scum bag, thanks for playing!")
        return False
    else:
        print("Purrr-fect, here we go again!\n")
        return True

def non_yes_response(response):
    return not response.lower().startswith('y') and not 'yes' in response.lower()

def play_one_hand(chips):
    # Funcs < one screen
    deck = Deck()
    deck.shuffle()
    player = Hand()
    dealer = Hand()

    for _ in range(0,2):
        player.add_card(deck.deal())
        dealer.add_card(deck.deal())

    take_bet(chips)
    clear_screen()
    show_cards(dealer, player, True)

    while hit_or_stand(deck, player):
        show_cards(dealer, player, True)
        if player.is_busted():
            clear_screen()
            show_cards(dealer, player, False)
            end_round("player_bust", False, chips)
            return

    clear_screen()
    print("\nDealer will now play\n")
    show_cards(dealer, player, False)

    dealers_turn(dealer, player, deck, chips)

    if player.value >= dealer.value:
        clear_screen()
        show_cards(dealer, player, False)
        end_round("player_win", True, chips)
        return
    else:
        clear_screen()
        show_cards(dealer, player, False)
        end_round("dealer_win", True, chips)
        return

def dealers_turn(dealer, player, deck, chips):
    while dealer.value < constant.DEALER_CEILING:
        time.sleep(2)
        clear_screen()
        hit(deck, dealer)
        show_cards(dealer, player, False)

        if dealer.is_busted():
            clear_screen()
            show_cards(dealer, player, False)
            end_round("dealer_bust", True, chips)
            return

# class Game(object):
#     def __init__():
#         self.player = ...
#         self.dealer = ...
#         self.deck = ...

def start():
    clear_screen()
    print("\nWelcome to Bootleg Blackjack, punk!\nHere's some essential 411:\n\t* Start with $100\n\t* Odds at 2.0\n")
    chips = Chips()
    keep_playing = True

    while keep_playing:
        play_one_hand(chips)

        if chips.bankrupt():
            # clear_screen()
            print("Looks like you've gone broke, good thing you weren't playing for real money...\nThanks for playing, scumbag!\n")
            keep_playing = False
        else:
            keep_playing = replay()

def clear_screen():
    print("\n" * 100)

if __name__ == '__main__':
    start()
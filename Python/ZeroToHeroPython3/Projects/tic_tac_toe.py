
import random

def display_board(board):
    clear_output()
    print("     |     |")
    print("  "+board[7]+"  |  "+board[8]+"  |  "+board[9])
    print("     |     |  ")
    print("-----*-----*-----")
    print("     |     |  ")
    print("  "+board[4]+"  |  "+board[5]+"  |  "+board[6])
    print("     |     |  ")
    print("-----*-----*-----")
    print("     |     |  ")
    print(f"  {board[1]}  |  "+board[2]+"  |  "+board[3])
    print("     |     |  ")

def clear_output():
    print("\n"*100)

def place_marker(board, marker, pos):
    board[pos] = marker
    display_board(board)

def space_free(board, position):
    return board[position] == ' '

def board_full(board):
    for i in range(1, 10):
        if space_free(board, i):
            return False
    return True

def win_check(board, mark):
    winning_positions = ((1,2,3), (4,5,6), (7,8,9), (1,4,7), (2,5,8), (3,6,9), (1,5,9), (3,5,7))
    for position in winning_positions:
        if (board[position[0]] == mark and
            board[position[1]] == mark and
            board[position[2]] == mark):
            return True
    return False

def player_input():
    marker = ''

    while marker != 'X' and marker != 'O':
        marker = input("Player 1, choose 'X' or 'O': ")

    player1 = marker
    player2 = "O" if player1 == "X" else "X"

    return (player1, player2)

def choose_first_player():
    return random.randint(0, 1) + 1

def choose_position(board):
    position = None

    while position not in range(1, 10) or not space_free(board, position):
        try:
            position = int(input("Choose your next position: (1-9) "))
        except ValueError:
            position = None

    return position

def replay():
    replay = input("Do you want to play again? Y / N : ")
    if (non_yes_response(replay)):
        print("I'll take that as a no...\nThanks for playing, dirt bags!")
        return False
    else:
        print("Alright let's do this\n")
        return True

def non_yes_response(response):
    return not response.lower().startswith('y') and not 'yes' in response.lower()

def play_one_game(player1_marker, player2_marker, turn):
    board = [" "] * 10

    run_game = True
    while run_game:
        player = player1_marker if turn == 1 else player2_marker

        display_board(board)
        position = choose_position(board)
        place_marker(board, player, position)

        if (win_check(board, player)):
            display_board(board)
            print(f"Congratulations, Player {turn}! You are the one and only winner.")
            run_game = False
        elif (board_full(board)):
            display_board(board)
            print("Looks like neither of you weenies has the gusto to beat the other..it's a draw!")
            run_game = False

        turn = 2 if turn == 1 else 1

def start():
    print("***************************\n| Welcome to Tac-Tac-Toe! |\n***************************")
    wants_replay = True
    while wants_replay:
        player1_marker, player2_marker = player_input()
        turn = choose_first_player()
        print(f"\nPlayer {turn}, because they are a lucky duck, will go first.\n")

        run_game = input("Are you ready to begin? Y / N ")
        if non_yes_response(run_game):
            run_game = input("Ok then...well how about now? Y / N ")
            if non_yes_response(run_game):
                print("Your loss then...")
                wants_replay = False
                continue

        play_one_game(player1_marker, player2_marker, turn)

        wants_replay = replay()

if __name__ == '__main__':
    start()
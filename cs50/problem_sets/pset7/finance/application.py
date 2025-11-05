import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd


# Redirect options via Flask API:
    # return redirect("/")
    # return redirect(url_for("index"))

# TO-DO:
# Update transaction table namespacing
    # STORE sales as negatives and buys as positives
    # SCHEMA: id, user_id, symbol, shares, price_per_share, created_at

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    user = db.execute("SELECT cash FROM users WHERE id = :user_id", user_id=session["user_id"])
    cash = user[0]["cash"]
    total = cash

    stocks = db.execute("SELECT symbol, SUM(shares) as total_shares FROM transactions WHERE user_id = :user_id GROUP BY symbol HAVING total_shares > 0", user_id = session["user_id"])
    prices = {}
    for stock in stocks:
        prices[stock["symbol"]] = lookup(stock["symbol"])

    return render_template("portfolio.html", stocks=stocks, prices=prices, total=total, cash=cash)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "POST":
        if not request.form.get("symbol"):
            return apology("symbol cannot be blank", 400)

        quote = lookup(request.form.get("symbol"))

        if quote == None:
            return apology("invalid symbol", 400)

        # Using try to see if we can convert the shares value to an int,
        # if we fail, we know its not an int
        try:
            shares = int(request.form.get("shares"))
        except:
            return apology("shares must be a positive integer", 400)

        if shares <= 0:
            return apology("can't buy 0 or less shares")

        cash_query = db.execute("SELECT cash FROM users WHERE id = :user_id", user_id=session["user_id"])

        user_cash = cash_query[0]["cash"]
        share_price = quote["price"]

        print(share_price)
        print()

        if share_price * float(request.form.get("shares")) > user_cash:
            return apology("not enough funds", 400)

        # Subtract the cost, update user cash
        user_cash -= share_price * float(request.form.get("shares"))
        transaction = db.execute("UPDATE users SET cash = :user_cash WHERE id = :user_id", user_cash=user_cash, user_id=session["user_id"])
        if not transaction:
            return apology("transaction failed, please try again", 404)

        # Only after we logged the cash update so we update transaction table
        db.execute("INSERT INTO transactions VALUES (:user_id, :symbol, :shares, :price_per_share)",
            user_id = session["user_id"],
            symbol = request.form.get("symbol"),
            shares = shares,
            price_per_share = share_price)

        flash("Bought!")
        return redirect("/")
    else:
        return render_template("buy.html")


@app.route("/history", methods=["GET"])
@login_required
def history():
    """Show history of transactions"""
    transactions = db.execute("SELECT symbol, shares, price_per_share, created_at FROM transactions WHERE id = :user_id ORDER BY created_at ASC")

    return render_template("history.html", transactions=transactions)


@app.route("/funds/add", methods=["GET", "POST"])
@login_required
def add_funds():
    if request.method == "POST":

        try:
            funds = float(request.form.get("amount"))
        except:
            return apology("amount must be a real number")




        cash = db.execute("SELECT cash FROM users WHERE id = :user_id", user_id = session["user_id"])[0]["cash"]
        cash = cash + funds

        db.execute("UPDATE users SET cash = :cash WHERE id = :user_id", cash = cash, user_id = session["user_id"])
        return redirect("/")
    else:
        return render_template("add_funds.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "POST":
        symbol = request.form.get("symbol")
        quote = lookup(symbol)

        if quote == None:
            return apology("invalid symbol", 400)
        else:
            return render_template("quoted.html", name=quote["name"], price=quote["price"], symbol=quote["symbol"])
    else:
        return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":

        # ensure username
        if not request.form.get("username"):
            return apology("must provide username", 400)

        # ensure password
        elif not request.form.get("password"):
            return apology("must provide password", 400)

        # check is password matches confirmation
        elif request.form.get("password") != request.form.get("confirmation"):
            return apology("passwords do not match", 400)

        hash = generate_password_hash(request.form.get("password"))
        new_user_id = db.execute("INSERT INTO users (username, hash) VALUES (:username, :hash)", username = request.form.get("username"), hash = hash)

        if not new_user_id:
            return apology("username taken", 409)

        session["user_id"] = new_user_id

        flash("Registered successfully!")

        return redirect("/")
        ## could also do return redirect(url_for("index")) // BOTH valid and using Flask API
    else:
        return render_template("register.html")

@app.route("/change_password", methods=["GET", "POST"])
@login_required
def change_password():
    if request.method == "POST":

        #check current password existence
        if not request.form.get("current_password"):
            return apology("missing current password", 400)

        #get current user
        current_user = db.execute("SELECT hash FROM users WHERE id = :user_id", user_id=session["user_id"])

        #current password matches?
        if not check_password_hash(current_user["hash"], request.form.get("current_password")):
            return apology("invalid password")

        # check existence of new password
        if not request.form.get("new_password"):
            return apology("missing new password", 400)

        # check existence of new password confirmation
        elif not request.form.get("new_password_confirmation"):
            return apology("missing new password confirmation", 400)

        # check new passwords match
        elif request.form.get("new_password") != request.form.get("new_password_confirmation"):
            return apology("new passwords don't match", 400)

        hash = generate_password_hash(request.form.get("new_password"))
        db.execute("UPDATE users SET hash = :hash WHERE user_id = :user_id", user_id = session["user_id"], hash = hash)
        flash("Changed!")
    return render_template("change_password.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    if request.method == "POST":
        quote = lookup(request.form.get("symbol"))

        if quote == None:
            return apology("invalid symbol", 400)

        try:
            shares = int(request.form.get("shares"))
        except:
            return apology("must provide a positive integer", 400)

        if shares <= 0:
            return apology("can't sell 0 or negative shares", 400)

        stock = db.execute("SELECT SUM(shares) as total_shares from transactions WHERE :user_id = user_id AND symbol = :symbol GROUP BY symbol", user_id = session["user_id"], symbol = request.form.get("symbol"))

        if  len(stock) != 1 or stock[0]["total_shares"] < shares:
            return apology("you cannot sell more shares than you own", 400)

        user = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))
        total_sale_price = shares * quote["price"]
        total_user_cash = user[0]["cash"] + total_sale_price

        db.execute("UPDATE users SET cash = :cash WHERE user_id = :user_id", cash = total_user_cash, user_id = session["user_id"])
        db.execute("INSERT INTO transactions VALUES (user_id, symbol, shares, price_per_share) VALUES (:user_id, :symbol, :shares, :price_per_share",
            user_id = session["user_id"],
            symbol = request.form.get("symbol"),
            shares = shares * -1,
            price_per_share = quote["price"])

        flash("Sold!")

        return redirect("/")
    else:
        stocks = db.execute("SELECT symbol, SUM(shares) as total_shares FROM transactions WHERE user_id = :user_id GROUP BY symbol HAVING total_shares > 0", user_id = session["user_id"])
        return render_template("sell.html", stocks=stocks)


def errorhandler(e):
    """Handle error"""
    return apology(e.name, e.code)


# listen for errors
for code in default_exceptions:
    app.errorhandler(code)(errorhandler)

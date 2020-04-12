### Sending Emails
* `import smtrplib` simple mail transfer protocol library
    - `conn = smtplib.SMTP('smtp.gmail.com', 587)` 587 typical port
    - `conn.ehlo()`
    - `conn.starttls()` => `conn.login()`
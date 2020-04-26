"""
Goal: get this runnable with a single command, monitor it, and restart it when it gets unhappy
Gotchas:
- flask isn't built-in
- this sometimes just throws single errors and we don't wanna always restart it
- the server takes some time to start-up
"""

import flask
import flask_cors
import random
import os
import time


app = flask.Flask(__name__, static_url_path='')


def run():
    # Simulate server startup time
    time.sleep(random.randint(6, 10))

    flask_cors.CORS(app)
    app.debug = False
    port = os.getenv('SERVER_PORT', 'UNSET!')
    app.run(host='0.0.0.0', port=port, use_reloader=False, threaded=True)

IS_PERMANENTLY_BROKEN = False

@app.route('/', methods=['GET'])
def root():
    global IS_PERMANENTLY_BROKEN

    # Simulate random failures
    action = random.randint(1, 100)
    print(action)
    if action <= 15 or IS_PERMANENTLY_BROKEN:
        flask.abort(500)
    elif action <= 20:
        print("Going down permanently")
        IS_PERMANENTLY_BROKEN = True
        flask.abort(500)
    # TODO: enable the hang case
    # elif action <= 21:
    #     print("Hanging for a while")
    #     time.sleep(1000.0)

    return flask.jsonify({"ok": True})


if __name__ == '__main__':
    run()
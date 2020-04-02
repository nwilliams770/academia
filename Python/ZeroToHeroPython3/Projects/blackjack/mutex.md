d = {
    'a': 1,
    'b': 2,
}

Non-atomic operation


d['a'] += 3
self.atomic_increment('a', 3)

import threading

def __init__(self):
    self.lock = threading.Lock()

def atomic_increment(self, key, value):
    with self.lock:
        d[key] += value



    x = d['a']     1
    x += 3         4
    d['a'] = x     4


d['a'] -= 1
    y = d['a']     1
    y -= 1         0
    d['a'] = y     0
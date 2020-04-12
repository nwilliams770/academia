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

=======================

import threading
<!-- queue -->


mutex = threading.Lock()

def print_as():
    for i in range(10000):
        with mutex:
            print("a") * 100


def print_bs():
    for i in range(10000):
        with mutex:
            print("b") * 100

t_a = threading.Thread(target=print_as)
t_b = threading.Thread(target=print_bs)
t_a.start()
t_b.start()

print("this probably prints somewhere in the middle of all the As and Bs")

# wait for both to finish
t_a.join()
t_b.join()

print("All done")
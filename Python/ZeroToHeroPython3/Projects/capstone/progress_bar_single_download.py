import threading
import time
import queue

BYTES = 100000
DOWNLOAD_RATE = 40000 #bps
BAR_SIZE = 30
FRAME_RATE = 60

# mutex = threading.Lock()
progress_queue = queue.Queue()

class FileTransfer:
    def __init__(self, size, rate):
        self.size = size
        self.rate = rate
        self.downloaded = 0

    @property
    def is_complete(self):
        return self.downloaded == self.size

def download():
    transfer = FileTransfer(size=BYTES, rate=DOWNLOAD_RATE)
    while not transfer.is_complete:
        # For mocking purposes
            # only running 100 times per second, so we want to pass fractions of the chunk
        time.sleep(.01)
        transfer.downloaded += (transfer.rate * 0.01)
        progress_queue.put(transfer)

def clear_screen():
    print("\n" * 100)

def update_UI(transfer):
    clear_screen()
    num_download_stars = int(transfer.downloaded / transfer.size * 30)
    print(f"Downloading... {int(transfer.downloaded / 100)}/{int(transfer.size / 100)} kb")
    print("[" + "*" * num_download_stars + "-" * (30 - num_download_stars) + "]")

def start():
    t_download = threading.Thread(target=download)
    t_download.start()
    then = time.time()
    while True:
        try:
            transfer = progress_queue.get(block=True, timeout=1.0)
        except queue.Empty:
            print("Timed out, sucka!")
            return
        now = time.time()

        if now - then > 1.0 / float(FRAME_RATE): #s
            update_UI(transfer)
            then = now

        if transfer.is_complete:
            break
    print("Download Complete!")

if __name__ == "__main__":
    start()













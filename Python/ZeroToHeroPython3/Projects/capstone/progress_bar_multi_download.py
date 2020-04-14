import threading
import time
import queue
import concurrent.futures
import random

# ThreadPool vs ProcessPool
# * Spawning a new processes create a new instance of Python interpreter, thus creating new processes is more
# memory intensive
# * Multiprocessing is better for more compute intensive tasks, such as running multiple simulations at the same time
# or data analysis from multiple sources
# * Multithreading more ideal for less CPU-intensive tasks such as communication across the web

BYTES_PER_DOWNLOAD = 100000
NUM_DOWNLOAD_ITEMS = 20
DOWNLOAD_RATE = 40000 #bps
BAR_SIZE = 30
FRAME_RATE = 60

progress_queue = queue.Queue()

class FileTransfer:
    def __init__(self, size, rate, identifier):
        self.size = size
        self.rate = rate
        self.identifier = identifier
        self.downloaded = 0

    @property
    def is_complete(self):
        return self.downloaded == self.size

def download(transfer):
    while not transfer.is_complete:
        # For mocking purposes
            # only running 100 times per second, so we want to pass fractions of the chunk
        time.sleep(.01)
        download_packet = int(transfer.rate * 0.01)
        if transfer.downloaded + download_packet > transfer.size:
            download_packet = transfer.size - transfer.downloaded
        transfer.downloaded += download_packet
        progress_queue.put(transfer)

def clear_screen():
    print("\n" * 100)

def update_UI(transfers):
    clear_screen()
    bytes_downloaded = sum([transfer.downloaded for transfer in transfers.values()])
    bytes_to_download = sum([transfer.size for transfer in transfers.values()])
    num_download_stars = int(bytes_downloaded / bytes_to_download * 30)

    print(f"Downloading... {int(bytes_downloaded / 100)}/{int(bytes_to_download / 100)} kb")
    print("[" + "*" * num_download_stars + "-" * (30 - num_download_stars) + "]")

def downloads_completed(transfers):
    return all([transfer.is_complete for transfer in transfers.values()])

def start():
    # Instantiate ThreadPool, max threads 10, *where to determine how many items/things to do done?*
    # Pass a queue around between those threads to check progress at regular intervals?
    #
    transfers = {}

    for i in range(NUM_DOWNLOAD_ITEMS):
        size = random.randint(50000, 1000000)

        transfer = FileTransfer(size=size, rate=DOWNLOAD_RATE, identifier=i)
        transfers[i] = transfer
        t_download = threading.Thread(target=download, args=[transfer])
        t_download.start()

    then = time.time()
    while True:
        try:
            transfer = progress_queue.get(block=True, timeout=1.0)
        except queue.Empty:
            print("Timed out, sucka!")
            return
        now = time.time()

        # Update our transfers
        transfers[transfer.identifier] = transfer

        if now - then > 1.0 / float(FRAME_RATE): #s
            update_UI(transfers)
            then = now

        if downloads_completed(transfers):
            break
    print("Download Complete!")



# ThreadPool
    # with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    #     executor.submit(download, args=[10])
    # pass

if __name__ == "__main__":
    start()
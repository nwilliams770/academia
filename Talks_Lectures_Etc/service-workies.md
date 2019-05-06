## Google Service Workies PWA course/game (https://serviceworkies.com/)
- `navigator.serviceWorker.register(js_path)`
    - safe to register the same worker repeatedly, however, if code is different, a new worker is instead created (registered workers cannot have their mode updated)
- cycle of worker: instal (registering the worker), wait (for any workers ahead in queue), activate (), terminate (navigating away from page where workers, active or waiting, are installed)
- while service worker is active, the waiting service worker will be replaced on page refresh with code changes (e.g. active service worker remains in control)


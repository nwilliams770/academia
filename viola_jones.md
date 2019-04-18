## Rapid Object Detection using a Boosted Cascade of Simple Features
- Abstract:
    - Visual object detection rapidly and with high detection rates with three key contributions:
        - "Integral Image", new image representation for rapid calculation
            - The system doesn't work directly with image intensities but rather, constructs the Integral Image (a few operations per pixel) that can be used to compute Harr-like features (Haar Basis functions) in constant time
        - Learning algo based on AdaBoost, selects small # of critical features from larger set and yields efficient classifiers
            - 
        - "Cascade", method for combining complex classifiers which allows bg regions to be quickly discarded while spending more computations on "object-like" regions
- This combination contruct a framework for rapid object detection

### Features
- Classifies images based on simple features as opposed to pixels directly. Features over pixels because it is 1). much quicker 2). features can encode ad-hoc domain knowledge that is difficult to learn on small training data
- Features are, two-, three-, and four- rectangle features, computes sum of one space and subtracts from sum of other space
- Base resolution of detector is 24x24 so, with the image sizes they were working with, set of features was over 180k
- Computing these features however can be very rapid by using an intermediate representation called the Integral Image
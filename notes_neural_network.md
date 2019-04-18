#### Convolutional Neural Networks
- Like how a child's brain is fed indentified stimuli in order to develop a model of the surrounding environment, we show an algorithm millions of pictures before it can generalize the input and make predictions on new, unseen, input.
- To recognize images, we use a CNN
- Convolution is an operation performed on two functions to produce a third function that expresses how the shape of one is modified by the other
- Note that hierachy is key to CNNs and our own vision; info is stored in sequences of patterns in sequential order

- Neural Networks transform input by putting it through a series of fully connected hidden layers and there is a last final fully-connected layer that represent the predictions. 
- CNNs have layers organized in 3 dimensions: width, height, and depth. Furthermore, each layer does not fully connect to the next, only a small region. The output is reduced to a single vector of probability scores, organized along depth dimension.
- Two main components:
    - Hidden Layers/ Feature extraction: Primary purpose to extract features from the input image
        - The convolution layer parameters are a set of learnable filters (kernels or feature detector) that used for recognizing patterns. Convolution works by sliding the filter over input image and performing an operation between the filter and chunks of input image
        - The pooling layer (sub-sampling or down-sampling) reduce the size of the feature maps by using functions to summarize sub-regions such as taking average or maximum value. Slides a window across the feature map and feeds the content of the window to the pooling function
            - We do this to reduce number of params in network and make learned features more robust by making them more invariant to scale and orientation (e.g. an upside-down image)
        - ReLU (Rectified Linear Unit) is an element wise operation (applied per pixel) that replaces negative pixel values in the feature map with zero.
            - We do this to introduce non-linearity to the CNN (e.g. output won't change in proportion to or in relationship to the input).
            - Other non-linear functions are tanh or sigmoid but ReLI
    - Classification part: This fully-connected layer (e.g. all neurons in previous layer be it fully-connected, pooling, or convolutional, are connected to every neuron it has) serves as an classifier on top of the extracted features. 
        - Essentially a way of learning non-linear combos of the extracted features. Features learned from convolutional and pooling layers may be good but combinations of them might be even better
        - 
        - 
- To summarize: 
    - Convolution is performed on the input data with the use of a filter or kernel to produce a feature map. We execute convolution by sliding the filter over the input and at every location, a matrix multiplication is performed and sums the result onto the feature map. The area of our filter is also called the receptive field, named after neuron cells.
    - We perform numerous convolutions on our input, where each operation uses a different filter, which results in different feature maps. In the end we take all of these feature maps and put them together as the final output of the convolution layer
    - We use an activation function to make our output non-linear (the output of the convolution is passed through, this is our ReLU, tanh, sigmoid)
    - Stride is the size of the step the convolution filter moves each time. 
    - We use a padding of zero-value pixels around the input so that our feature map will not shrink. Padding also improves performance and makes sure rthe kernel and stride size will fit the input
    - It is common to add a pooling layer after a convolution layer. Function of this pooling layer is to continuously reduce the dimensionality to reduce number of params and computation. Shortens training time and controls overfitting (contains more params that can be justified by the data)
    - Max pooling is msot common, takes max value in a specified window size. Decreases feature map size while keeping the significant info
    - The Hyperparamters (params whose value is set before learning process begins) are kernel size, filter count (how many filters do we want to use), stride (how big are steps of the filter), padding
    - After convolution and pooling layers, our classification part consists of a few fully connected layers. They can only accept 1 Dimensional data and our data (as mentioned) is 3D. We can use the `flatten` function in Python to arrange our 3D volume in a 1D vector (we use softmax on our last layer)

- Enter TensorFlow (used for numerical computation using data flow graphs). Nodes in the graph represent mathematical operations while the graph edges represent the multidimensional data arrays (tensors) that flow between them. 


#### Aside: Training a Network
- In CNNs we have synaptic weights. A vector of inputs and outputs are interconnected with these weights. These weights change by using a learning rule "Neurons that fire together, wire together". That is, if a large signal from one input neuron results in a large signal from out, the synaptic weight between them will increase -- this rule is unstable and usually modified with variations such as backpropagation, Oja's rule, radial basis functions
- We use random numbers between 0 and 1 for our initial weights
- In Python we use `random.seed(0)` and give it a fixed number to start with so we ALWAYS start with the same random numbers
-  Roughly two parts to training:
    - Forward propagation: Making steps forward and comparing those results with the real values to get difference between your output and what it should be. Basically seeing how the NN is doing and find the errors.
        - Once weights initialized we take a step forward per se, taking input A0 times dot product (operation that takes two-equal length sequences of number sand return a single number) plus a bias (bias usually started at 0). That linear step is passed through our first activation function and creating our first hidden layer
        - ** Because we are dealing with a multi-class classification problem (in this case, 3 different labels for bottles of wine) we use the softmax function for the output layer which will compute the probabilities for the classes by spitting out a value between 0 and 1.
        - In Python, we store and return all those values in a POJO
    - Backwards propagation: After we forward propagate, we backward propagate our error gradient to update weight parameters. We know our error at this point and want to minimize it. We do this by taking derivative of error function with respect to the weights by using gradient descent. 
        - calculate slope of loss function with respect to z, slope of linear step we take. Next calculate slope of loss function with respect to our weights and biases. Then we take the derivative of those
    - In order to reach optimal weights and biases, we have to train the network. We train in epochs (one full training cycle)
        - Like any training, we have a learning rate (alpha) that we must set. 
    - To summarize the whole network: We feed in data and perform several matrix operations on this data, layer by layer. For each layer, we take the dot product of the input by the weights and add a bias then pass that output through an activation function we choose. This is done three more times since we have three layers. Final output is y-hat, which is prediction of what wine belongs to which cultivar. This is the end of the forward propagation process.

    We then calculate difference between the y-hat and the expected output and use this error during backpropagation. We mathematically push our error back through the NN--taking derivative of functions used in the forward propagation, we try to discover the value of our weights for the best possible prediction. 
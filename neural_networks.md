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
- In NNs we have synaptic weights. A vector of inputs and outputs are interconnected with these weights. These weights change by using a learning rule "Neurons that fire together, wire together". That is, if a large signal from one input neuron results in a large signal from out, the synaptic weight between them will increase -- this rule is unstable and usually modified with variations such as backpropagation, Oja's rule, radial basis functions
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

    ## Recurrent Neural Networks
- Key feature is that they have loops, allowing information to persist. Imagine multiple copies of the same network each passing a message to a successor. The loop can be 'unfolded' per se
- Because of this structure, they're the natural structure to use when input is sequences and lists
- Before we discuss them further, let's talk about **Word2Vec**:
    - model used for learning vector representations of words called 'word embeddings'. Typical to do as a preprocessing step before feeding vectors into a model (usually a RNN) to generate predictions and patterns
    - In image and audio processing systems, info is encoded resulting in relations between various entities in the system
    - For natural language processing (NLP), words are unique and discrete symbols. This can, our model can leverage very little of one symbol when learning about another
        - Because of this, we need more data and vector representations can help address some of this because deep learning, at most basic level, is all about representational learning
        - One way to represent them is a co-occurence matrix but most famous way of representation is Word2Vec
    - Vector space models (VSMs) 'embed' words in a continuous vector space where semantically similar words are mapped to nearby points ('embedded near each other'). 
    - Depend on the Distributional Hypothese, states that words that appear in same contexts share semantic meaning. Different approaches to leveraging this principle are:
        - Count-based methods (Latent Semantic Analysis): compute how often some word occurs with neighbor words in a large corpus and maps these down to a small, dense word vector for each word
        - Predictive methods (Neural PRobabilistic Language Models): Try to predict a word from its neighbors in terms of small, dense embedding vectors (considered params of the model)
    - Word2Vec is an efficient predictive model in two flavors: Continuous Bag-of-Words model (CBOW) and Skip-Gram model. CBOW predicts target words from source context words, skip-gram does inverse and predicts source context-words from target words
    - Our focus will be on skip-gram model
    - Predictive models traditionally training using Maximum Likelihood principle to maximize probability of next word wt (for "target") given previous words h (for "history") in terms of a softmax func
    - It is quite costly to do this for EVERY word as it requires looking at every other word, so for feature learning in word2vec, we use a binary classification objective (logistic regression) to discrimibate real target words from noise words
    - This objective maximized when model assigns high probabilities to real words and low ones to noise words, this is technically called Negative Sampling. Appealing to us because loss functions now scales only with number of noise words, not all wrods in vocab
    - Objective func defined over entire dataset but typically optimize this with stochastic gradient descent using one example at a time or a minibatch of batch_size samples, typically between 16 and 512
- RNNs are more exciting than a CNN because they allow us to operate over sequences of vectors: sequences in input, output, or in most cases both
- Do how do they work?
    - Input is vector x, output is vector y. output is influenced not only by input but by entire history of inputs fed in the past
    - as we feed in input, we are calling a step func, which updates the hidden state which is then squashed to values in the range [-1, 1] via np.tanh
        - one value inside that tanh is based on previous hidden state and the other is based on current input
    - In the field, most use a particular type of RNN called a Long Short-Term Memory network (LSTM)--pretty much the same as a Vanilla RNN we reviewed but computing the update is a bit more complicated
- In very general terms, Forward-Propagation is done to get output of your model and check its correctness e.g. to get the error
- Next Backward-Propagation is done, going backwards through the neural network to find partial derivative of the error with respect to the weights, which enables you to subtract this value from the weights
    - Those derivatives are used by the Gradient Descent algo, and adjusts weights up or down
- Backpropagation Through Time is doing backpropagation on an unrolled RNN, essentially allowing you to visualize and understand what's going on in the network
- Issues with standard RNNs:
    - exploding gradients: algo assigns super high importantance to weights without much reason, usually solved through squashing the gradients
    - vanishing gradient: values of gradient too small and model stops learning, solved through concept of LSTM networks
- LSTM's enable RNNs to remember their inputs for long periods of time. 
    - This memory can be read, written, and deleted based on the importance assigned to the information stored (these are described as 'gates')
    - 
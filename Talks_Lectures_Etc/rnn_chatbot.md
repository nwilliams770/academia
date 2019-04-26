## RNN Chatbot
### Chatbots, theories of conversation:
- When we think of a synthesizing language, must note that language meaning is beyond labels, it is grounded in experience, "heteroglossia" (standard language made up of multiple "voices")
- When we're understood, we can easily give and receive instructions for cooperation. When we're not understanding each other:
    - Coordination of inner worlds, if that fails then, coordination of meaning
    - Once understanding is reached at one level, we can return to clarify the previous level
    - Catch me fish => you can catch with a fishing pole => a fishing pole is a stick with a hook
- Conversation has its own rules as well, consider Grice's conversational maxims:
    - Maxim of quantity: say only what is not implied. 
    - ""     "" quality: say only things that are true
    - ""     "" relevance: say only things that matter
    - ""     "" manner: speak in a way that is easily understood
    - When we break a maxim, we are seeking to add meaning than just the meaning of the words

### Classes of Chatbots
- We'll look at three classes of chatbots: purposeless mimicry agents, intention-based agents, and conversational agents.
- Purposeless Mimicry Agents: 
    - Give appearance of convo without understanding what is being said. first example is ELIZA
    - modern mimicry agents use deep learning to learn from example convos and learn to generate the next statement given the previous one
    - sequence-to-sequence models used for this deep learning methods: consists of an encoder and decoder, both actions done using RNNs
    - problem with this deep learning approach is they are devoid of meaning and are generally insensitive to specifics
- Intention-based Agents: 
    - Understand language as commands and use that to perform tasks e.g. Alexa, Siri, Cortana
    - They must:
        - Identify what the user wants the machine to do (the "intent")
        - Figure out details of the intent so machine can perform task
    - Can determine intent by keywords or text-based classification:
        - keywords means associating words and phrases with intents
        - text-based, label statements with correct intents then train a classifier over them
    - Can use scikit-learn to train, or if you have enough labeled data, you can use a convolutional neural network
    - Once we have intent, we must convert to machine-readable forms, such as a Python dict
    - Having the command in this dict format is called frame and slot semantics, where frame is the topic and the slots are the features and values. Once we have instructions, we can perform action
    - We can do natural language processing using context-free grammars:
        - consist of production rules that ahve a single nonterminal on the left and a string on the right of terminals and nonterminals
        - To each of these production rules, we add a semantic attachment, clarifying the steps needed to be taken and any specifics (one of these may be determing the intent)
- Conversational agents
    - These expand on intention-based agents to have multi-turn convos. They must keep track of state of convo and know when person wants to talk about somethnig else

### Rule based bots vs AI bots
- Approaches for a "human-like" bot:
    - Rule-based: Responses based on trained rules--fails where rules aren't defined and time consuming to implemnt
    - Self-learnable: ML-approach to make more efficient
        - Retrieval based models: trained on set of questions and possible outcomes; finds most relevant answer for each q. Performance is heavily determined by training data and rules/algos when handling answer queries
        - Generative models: Generate answers, each word in query contributes to generation but requires more precise training due to potential spelling/grammar errors.  
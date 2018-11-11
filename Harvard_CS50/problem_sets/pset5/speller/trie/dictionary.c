// Implements a dictionary's functionality
#include <string.h>
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "dictionary.h"

typedef struct node
{
    bool is_word;
    struct node *children[ALPHABET + 1];
}
node;

// We're gonna have the root a node itself, not just a node pointer
node root = NULL;

// Keeps track of the # of words in dictionary
unsigned long words = 0;

// Returns true if word is in dictionary else false
bool check(const char *word)
{
    // TODO
    return false;
}

// Loads dictionary into memory, returning true if successful else false
bool load(const char *dictionary)
{
    // open the file, checking if pointer is NULL
    FILE* file = fopen(dictionary, "r");
    if (!file)
    {
        return false;
    }

    root = create_node;
    if (root == NULL)
    {
        return false;
    }

    char buffer[LENGTH];
    while (fscanf(file, "%s", buffer) != EOF)
    {
        // if we're unable to insert, unload all the memz get outta there
        if (!insert_node(root, buffer))
        {
            unload();
            break;
        }

        words++;
    }

    fclose(file);

    return true;
}

// Returns number of words in dictionary if loaded else 0 if not yet loaded
unsigned int size(void)
{
    return words;
}

// Unloads dictionary from memory, returning true if successful else false
bool unload(void)
{
    unload_trie(root);
    return true;
}

unsigned int hash(const char letter)
{
    // assign the last position to the apostrophe
    if (letter == '\'')
    {
        return ALPHABET - 1;
    }

    // ignore case by converting the given letter to lowercase
    // a is ASCII 97 so we subtract 97 to normalize it to an index value
    return tolower(letter) - 97;
}

node create_node(void)
{
    node node = malloc(sizeof(struct node));
    if (node == NULL)
    {
        return false;
    }
    // is_word false by default
    node->is_word = false;
    // initialize children pointers to NULL
    for (int i = 0; i < ALPHABET + 1; i++)
    {
        node->children[i] = NULL;
    }

    return node;
}

bool insert_node(node root, const char *key)
{
    node node = root;


    // iterate over the key
    for (int i = 0, length = strlen(key); i < length; i++)
    {
        unsigned int hashed = hash(key[i]);

        if (node->children[hashed] == NULL)
        {
            node->children[hashed] = create_node();
        }

        node = node->children[hashed];

        //no more memory
        if (!node)
        {
            return false;
        }
    }
    // if we made it here we got to the last letter and can mark that node as a word!
    node->is_leaf = true;
}

void unload_trie(node root)
{
    if (root == NULL) {
        return;
    }

    for (int i = 0; i < ALPHABET; i++)
    {
        unload_trie(root->children[i]);
    }

    free(root);
}
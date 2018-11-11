// Implements a dictionary's functionality

#include <stdbool.h>
#include <string.h>
#include <ctype.h>
#include <stdio.h>
#include <stdlib.h>

#include "djb2.h"
#include "dictionary.h"

// define the struct and
struct node
{
    char word[LENGTH + 1];
    struct node *next;
};

typedef struct node *node;

node hashtable[HASHTABLE_SIZE];

unsigned long words = 0;

// Returns true if word is in dictionary else false
bool check(const char *word)
{

    char copy[strlen(word) + 1];
    strcpy(copy, word);
    char *p = copy;
    // one-liner by J.F. Sebastian
    for ( ; *p; ++p) *p = tolower(*p);

    unsigned long hash = djb2(copy) % HASHTABLE_SIZE;
    node cursor = hashtable[hash];

    while (cursor != NULL)
    {
        if (strcmp(cursor->word, copy) == 0)
        {
            return true;
        }

        cursor = cursor->next;
    }
    return false;
}

// Loads dictionary into memory, returning true if successful else false
bool load(const char *dictionary)
{
    // open the file, checking if pointer is NULL
    FILE* file = fopen(dictionary, "r");
    if (file == NULL)
    {
        return false;
    }

    // NULL all values in the hashtable
    for (int i = 0; i < HASHTABLE_SIZE; i++)
    {
        hashtable[i] = NULL;
    }

    char buffer[LENGTH];
    while (fscanf(file, "%s", buffer) != EOF)
    {
        // Allocate memory for new node, return if fails
        node new_node = malloc(sizeof(struct node));
        if (new_node == NULL)
        {
            unload();
            return false;
        }
        // if successful, set the next pointer to NULL
        // copy the current word in buffer into node
        // and iterate our wordcount

        new_node->next = NULL;
        strcpy(new_node->word, buffer);
        words++;

        // now we hash the word and put it in our hash table
        unsigned long hash = djb2(buffer) % HASHTABLE_SIZE;

        // if we already have a value in that space of the hash table
        // we set our new node to point to the old one, then override it in the hash table
        if (hashtable[hash] != NULL)
        {
            new_node->next = hashtable[hash];
        }

        hashtable[hash] = new_node;

        fclose(file);
        return true;
    }

}

// Returns number of words in dictionary if loaded else 0 if not yet loaded
unsigned int size(void)
{
    return words;
}

// Unloads dictionary from memory, returning true if successful else false
bool unload(void)
{
    for (int i = 0; i < HASHTABLE_SIZE; i++ )
    {
        node pointer = hashtable[i];
        while (pointer != NULL)
        {
            node temp = pointer;
            pointer = temp->next;
            free(temp);
        }
    }
    return true;
}

# vectorizes the words to a vector embedding.
# http://ahogrammer.com/2017/01/20/the-list-of-pretrained-word-embeddings/
import numpy as np
from os import path
from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors
import string
import os
import sys
model = None
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

glove_path = path.join(path.dirname(path.abspath(__file__)), '..', 'dataset','glove.6B', 'glove.6B.200d.txt')
glove_w2v_path = path.join(path.dirname(path.abspath(__file__)),'..','dataset','glove.6B','glove.6B.200d.w2v.txt')
if not path.isfile(glove_w2v_path):
    eprint("w2v for glove doesn't exist.. making it w2v format...")
    glove2word2vec(glove_path, glove_w2v_path)
    eprint("w2v format conversion is done.")
else:
    eprint("w2v for glove exists.. skipping format conversion...")
eprint("w2v loading glove w2v model... This will take a long time...")
if os.environ['ENVIRON'] == "production":
    model = KeyedVectors.load_word2vec_format(glove_w2v_path, binary=False)
else:
    model = KeyedVectors.load_word2vec_format(glove_w2v_path, binary=False, limit=5000)
eprint("w2v loading done.")

def get_vector(word, dims):
    vec = None
    try:
        vec = model[word]
    except KeyError:
        vec = np.zeros(dims)
    return vec

def vectorize_dataset_words ( sentence_str,max_timesteps, dims):
    words = sentence_str.split(',"')[1].split(" ")[1:-1][:max_timesteps] # tokenization by space.

    # filter out punctuation
    table = str.maketrans('', '', string.punctuation)
    words = [w.translate(table) for w in words]

    # remove capitalizations.
    words = [word.lower() for word in words]

    # TODO: clean it up more here?
    # https://machinelearningmastery.com/clean-text-machine-learning-python/
    # vectorize it here.

    x = np.row_stack(tuple([get_vector(word, dims) for word in words]))
    # x is timesteps x dims. Yes: wv is a dim dimensional vector.
    if x.shape[1] != dims:
        eprint("ERROR! x columns doesn't equal dims.")
        exit(1)
    if x.shape[0] < max_timesteps:
        x = np.vstack((x, np.zeros((max_timesteps-x.shape[0], 200))))
    eprint("vectorize_words: shape of x (timesteps x dims): ", x.shape)

    return x

def vectorize_words(sentence_str, max_timesteps, dims):
    words = sentence_str.split(' ')

    # filter out punctuation
    table = str.maketrans('', '', string.punctuation)
    words = [w.translate(table) for w in words]

    # remove capitalizations.
    words = [word.lower() for word in words]

    # TODO: clean it up more here?
    # https://machinelearningmastery.com/clean-text-machine-learning-python/
    # vectorize it here.

    x = np.row_stack(tuple([get_vector(word, dims) for word in words]))
    # x is timesteps x dims. Yes: wv is a dim dimensional vector.
    if x.shape[1] != dims:
        eprint("ERROR! x columns doesn't equal dims.")
        exit(1)
    if x.shape[0] < max_timesteps:
        x = np.vstack((x, np.zeros((max_timesteps-x.shape[0], 200))))
    eprint("vectorize_words: shape of x (timesteps x dims): ", x.shape)

    return x



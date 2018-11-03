# vectorizes the words to a vector embedding.
# http://ahogrammer.com/2017/01/20/the-list-of-pretrained-word-embeddings/
import numpy as np
from os import path
from gensim.scripts.glove2word2vec import glove2word2vec
from gensim.models import KeyedVectors
import string
# returns numpy array of vector output.
glove_path = path.join(path.dirname(path.abspath(__file__)), '..', 'dataset','glove.6B', 'glove.6B.200d.txt')
glove_w2v_path = path.join(path.dirname(path.abspath(__file__)),'..','dataset','glove.6B','glove.6B.200d.w2v.txt')
if not path.isfile(glove_w2v_path):
    print("w2v for glove doesn't exist.. making it w2v format...")
    glove2word2vec(glove_path, glove_w2v_path)
    print("w2v format conversion is done.")
else:
    print("w2v for glove exists.. skipping format conversion...")

print("w2v loading glove w2v model... This will take a long time...")
model = KeyedVectors.load_word2vec_format(glove_w2v_path, binary=False)
print("w2v loading done.")
# calculate: (king - man) + woman = ?
#  result = model.most_similar(positive=['woman', 'king'], negative=['man'], topn=1)
#  print(result)

def vectorize_words(sentence_str, dims, max_timesteps):
    # TODO: dims and max_timesteps.
    words = sentence_str.split(',"')[1:-1].split(" ") # tokenization by space.

    # filter out punctuation
    table = str.maketrans('', '', string.punctuation)
    words = [w.translate(table) for w in words]

    # remove capitalizations.
    words = [word.lower() for word in words]

    # TODO: clean it up more here?
    # https://machinelearningmastery.com/clean-text-machine-learning-python/
    # vectorize it here.
    x = np.array([model.wv(word) for word in words])
    return x



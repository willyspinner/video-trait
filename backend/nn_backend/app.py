#!/usr/bin/env python3
# check https://scotch.io/bar-talk/processing-incoming-request-data-in-flask
# for more details.
import json
from dotenv import load_dotenv

load_dotenv("config.env")
from flask import Flask
import tensorflow as tf
from flask import request
from ml_model import vectorizer, PersonalityVector
from multiprocessing import Pool
import numpy as np
import sys
import os
from keras.models import model_from_json
from functools import reduce
graph = None
app = Flask(__name__)
model = None
port = 9500
max_timesteps = int(os.environ["max_timesteps"])
dims = int(os.environ["dims"])


# takes in a sentence and outputs the probabilities in each class (vector)
def worker(sentence):
    x = vectorizer.vectorize_words(sentence, max_timesteps, dims)
    x = x.reshape(1, x.shape[0], x.shape[1])
    print("perdicting sentence: ", sentence)
    result = model.predict(x)  # batch_size=1 , verbose=1)
    print("perdiction done")
    return result


@app.route("/analyze", methods=['POST'])
def handler():
    print("analyzing")
    if model is None:
        print("ERROR - MODEL IS NOT INITIALIZED")
    else:
        global graph
        with graph.as_default():
            sentences = request.get_json(force=True)
            print("type of sentences: ", type(sentences))
            print("len : ", len(sentences))
            result_vec = np.zeros((1, 16))
            for sentence in sentences:
                x = vectorizer.vectorize_words(sentence, max_timesteps, dims)
                x = x.reshape(1, x.shape[0], x.shape[1])
                print("perdicting sentence: ", sentence)
                result = model.predict(x)  # batch_size=1 , verbose=1)
                result_vec += result
            personality = PersonalityVector.to_personality(result_vec)
            print("got personality: ", personality)
            return personality


if __name__ == "__main__":
    archPath = ""
    weightsPath = ""
    if len(sys.argv) > 0:
        archPath = sys.argv[1]
    if len(sys.argv) > 1:
        weightsPath = sys.argv[2]
    if "NN_WEIGHT" in os.environ:
        weightsPath = os.environ["NN_WEIGHT"]
    if "NN_ARCH" in os.environ:
        archPath = os.environ["NN_ARCH"]
    print("arch path : ", archPath, " weightsPath : ", weightsPath)
    archFile = open(archPath, "r").read()
    model = model_from_json(archFile)

    model.load_weights(weightsPath)

    graph = tf.get_default_graph()

    print("running app at port ", port)
    app.run(debug=(True if os.environ["ENVIRON"] != "production" else False), port=port, use_reloader=False)

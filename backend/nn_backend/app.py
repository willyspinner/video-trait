#!/usr/bin/env python3
# check https://scotch.io/bar-talk/processing-incoming-request-data-in-flask
# for more details.
from dotenv import load_dotenv
load_dotenv("config.env")
from flask import Flask
import tensorflow as tf
from flask import request
from ml_model import vectorizer, PersonalityVector
import sys
import os
from keras.models import model_from_json
graph=None
app = Flask(__name__)
model = None
port = 9500
max_timesteps = int(os.environ["max_timesteps"])
dims = int(os.environ["dims"])
@app.route ("/analyze", methods=['POST'])
def handler():
    print("analyzing")
    if model is None:
        print("ERROR - MODEL IS NOT INITIALIZED")
    else:
        global graph
        with graph.as_default():
            wordstring = str(request.get_data())
            # x needs to be timesteps x dims.
            print("wordstring", wordstring)
            x = vectorizer.vectorize_words(wordstring, max_timesteps, dims)
            print("here ting: x dims before: ", x.shape)
            x = x.reshape(1, x.shape[0],x.shape[1])
            print("here ting: x dims : ", x.shape)
            result = model.predict(x,) #batch_size=1 , verbose=1)
            print('got result: ',result, "with shape: ",result.shape);
            personality = PersonalityVector.to_personality(result)
            print("got personality: ", personality)
            return personality


if __name__ == "__main__":
    archPath=""
    weightsPath=""
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
    app.run(debug=True, port=port)

#!/usr/bin/env python3
# check https://scotch.io/bar-talk/processing-incoming-request-data-in-flask
# for more details.
from flask import Flask
from flask import request
from keras.models import model_from_json
app = Flask(__name__)
model = None
@app.route ("/analyze", methods=['POST'])
def handler():
    print("analyzing")
    if model is None:
        print("ERROR - MODEL IS NOT INITIALIZED")
    else:
        req_data = request.get_json()
        words = req_data['words']
        # TODO: vectorize it here
        # feed it to our NN.


if __name__ == "__main__":
    # TODO: Load our network here. - Make a class to predict.
    archPath = "TODO - from env var OR from stdin"
    weightsPath = "TODO - from env var OR from stdin "
    archFile = open(archPath, "r")
    model = model_from_json(archFile)
    model.load_weights(weightsPath)

    app.run(debug=True, port=9500)

#!/usr/bin/env python3
#check https://scotch.io/bar-talk/processing-incoming-request-data-in-flask 
# for more details.
from flask import Flask
from flask import request
app = Flask(__name__)


@app.route("/analyze", methods=['POST'])
def handler():
    print("analyzing")
    req_data = request.get_json()
    words = req_data['words']
    # TODO: vectorize it here
    # feed it to our NN.


if __name__ == "__main__":
    # TODO: Load our network here. - Make a class to predict.
    app.run(debug=True,port=9500)

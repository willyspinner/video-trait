# THIS FILE initializes and trains the model - saves weights and architecture as json, 
# to be loaded later
from os import path
import sys
import h5py
from keras.models import model_from_json
from ml_model.vectorizer import vectorize_words
from ml_model.PersonalityVector import to_numpy_class_vector
from ml_model.LSTM import createLSTMModel

# ********** config ***********
max_timesteps = 30 # words
dims = 200
mbti_classes = 16
# **************** paths *************************
# dataset path
raw_dataset_path = path.join(path.dirname(path.abspath(__file__)), 'dataset', 'mbti_1.csv')
vectorized_dataset_X_path = path.join(path.dirname(path.abspath(__file__)), 'dataset', 'mbti_1_vectorized_X.h5')
vectorized_dataset_Y_path = path.join(path.dirname(path.abspath(__file__)), 'dataset', 'mbti_1_vectorized_Y.h5')

#
# weights n arch
weights_path = path.join(path.dirname(path.abspath(__file__)),'ml_model','weights')
architecture_path = path.join(path.dirname(path.abspath(__file__)),'ml_model','architectures')

model = None

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

# *****************  generate vectorized ndarray of dataset if not exists. *******************
if not (path.isfile(vectorized_dataset_X_path) and path.isfile(vectorized_dataset_Y_path)):
    # make the data here. vectorize it
    num_datapoints = sum(1 for line in open(raw_dataset_path)) - 1  # 1 for the initial type,post
    X_dset = None
    Y_dset = None
    with h5py.File(vectorized_dataset_X_path, "a") as f_X:
        with h5py.File(vectorized_dataset_Y_path, "a") as f_Y:
            X_dset = f_X.create_dataset("autochunk", (num_datapoints, max_timesteps, dims), maxshape=(num_datapoints, max_timesteps, dims))
            Y_dset = f_Y.create_dataset("autochunk", (num_datapoints, mbti_classes), maxshape=(num_datapoints, mbti_classes))
            eprint("vectorizing raw dataset....")
            raw_dataset = open(raw_dataset_path, "r")
            count = 0
            for line in raw_dataset:
                # skip initial
                # data is     TYPE,"word word word .. etc..."
                personality = line[:4]
                if personality == "type":
                    continue
                y = to_numpy_class_vector(personality)
                # now find x. should have dims: n of words (rows) x dim (columns).
                x = vectorize_words(line, dims, max_timesteps)
                X_dset[count, :, :] = x
                Y_dset[count] = y
                eprint("done processing line ", count, "out of ", num_datapoints)
                count += 1
            eprint("saving numpy array to hdf5.")




    # save dataset as vectorized_dataset_path
    eprint("saving vectorized dataset....")
else:
    eprint("vectorized dataset already present. Skipping word vectorization and saving...")


# make the architecture of the model.
archPath = createLSTMModel()


# *****************  train it using dataset  *******************

archFile = open(archPath,'r')
def vec_generator (csv_path):
    print("TODO")
model = model_from_json(archFile.read())



# evaluate it


# save it - output to stdout the paths of the weights and architectures.



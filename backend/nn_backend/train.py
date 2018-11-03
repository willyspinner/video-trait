# THIS FILE initializes and trains the model - saves weights and architecture as json, 
# to be loaded later
from os import path
import sys
import h5py
from keras.models import model_from_json
import numpy as np
from keras import optimizers
from ml_model.PersonalityVector import to_numpy_class_vector
from ml_model.LSTM import createLSTMModel
from keras.callbacks import ReduceLROnPlateau
import os
# ********* dataset path ************
raw_dataset_path = path.join(path.dirname(path.abspath(__file__)), 'dataset', 'mbti_1.csv')
vectorized_dataset_X_path = path.join(path.dirname(path.abspath(__file__)), 'dataset', 'mbti_1_vectorized_X.h5')
vectorized_dataset_Y_path = path.join(path.dirname(path.abspath(__file__)), 'dataset', 'mbti_1_vectorized_Y.h5')
# ********* config ************
max_timesteps = 30 # words
dims = 200
mbti_classes = 16
num_datapoints = 0
if os.environ["ENVIRON"] == "production":
    num_datapoints = sum(1 for line in open(raw_dataset_path)) - 1  # 1 for the initial type,post
else:
    num_datapoints = 100

# ********* tuning ************
traintest_split = 0.8 # train test split
learning_rate = 0.1
epochs=10
steps_per_epoch=10

# ********* weights and arch ************
weights_path = path.join(path.dirname(path.abspath(__file__)), 'ml_model', 'weights')
architecture_path = path.join(path.dirname(path.abspath(__file__)), 'ml_model', 'architectures')
model_weights_path = path.join(weights_path,"lstm-weights.h5")
model_architecture_path= path.join(architecture_path,"lstm.json")

model = None

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

# *****************  generate vectorized ndarray of dataset if not exists. *******************
if not (path.isfile(vectorized_dataset_X_path) and path.isfile(vectorized_dataset_Y_path)):
    from ml_model.vectorizer import vectorize_words
    # make the data here. vectorize it
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
                if count >= num_datapoints:
                    break
                personality = line[:4]
                if personality == "type":
                    continue
                y = to_numpy_class_vector(personality)
                # now find x. should have dims: n of words (rows) x dim (columns).
                x = vectorize_words(line, max_timesteps, dims)
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
archPath = createLSTMModel(max_timesteps, dims, mbti_classes, model_architecture_path, 0.001)


# *****************  train it using dataset  *******************
indices = [i for i in range(0, num_datapoints)]
np.random.shuffle(indices)
def generator(is_train=True, split=0.8):
    X = h5py.File(vectorized_dataset_X_path, "r")
    Y = h5py.File(vectorized_dataset_Y_path, "r")
    low_bound = 0
    high_bound = num_datapoints
    if is_train:
        high_bound = int(split * num_datapoints)
    else:
        low_bound = int(split * num_datapoints)
    while True:
        for i in indices[low_bound:high_bound]:
            yield X.get('autochunk')[i, :, :].reshape(1,max_timesteps,dims), Y.get('autochunk')[i].reshape(1, mbti_classes)


archFile = open(archPath,'r')
model = model_from_json(archFile.read())
adamax = optimizers.Adamax(lr=learning_rate)
model.compile(loss='binary_crossentropy', #categorical_crossentropy
                   optimizer=adamax,#'adadelta',
                   metrics=['accuracy'])
callbacks = [ReduceLROnPlateau(monitor='accuracy', factor=0.2,
    patience=3, min_lr=0.001)]
model.fit_generator(
    generator(is_train=True, split=traintest_split),
    steps_per_epoch=steps_per_epoch,
    epochs=epochs,
    verbose=1,   # progress bar
    use_multiprocessing=True,
    callbacks=callbacks
    )



# *****************  evaluate it *******************

eprint("evaluating....")
val  =model.evaluate_generator(
   generator(is_train=False ),
    verbose=1,
    steps=10
)
eprint(model.metrics_names)
eprint(val)

# save it - output to stdout the paths of the weights and architectures.
model.save_weights(model_weights_path)

eprint("saved at:")
print(model_weights_path)
print(model_architecture_path)


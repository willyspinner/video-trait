from keras.models import Sequential
from keras.layers import Dense,Dropout,LSTM, Masking
from keras.layers import Activation
from keras.utils import plot_model
from keras import optimizers
from keras.layers import Flatten
from keras import metrics
import numpy as np
from numpy import newaxis
import os
#*******************  INstructions************************
## THIS ONE GENERATES AN LSTM MODEL FOR YOU.
## CALL createLSTMModel(X,Y,modelName,architectureDir,weightsDir) to create a model
#***************************************************
def createLSTMModel(timesteps, dims, n_classes, architecturePath, dropout):
    lstm_dropout = dropout
    dim = dims
    model = Sequential()
    model.add(Masking(mask_value=0.0, input_shape=(timesteps, dim)))
    model.add(LSTM(48, #return_sequences=True,
                   dropout=lstm_dropout,
                   #recurrent_dropout = 0.3,
                   input_shape=(timesteps, dim),
                    #return_sequences=True
                   ))
    #model.add(LSTM(32, return_sequences=True))  # returns a sequence of vectors of dimension 32
    #model.add(LSTM(8))
    #model.add(Dense(32)
    model.add(Dense(n_classes, activation='sigmoid'))
    model.add(Activation('tanh'))  # I NEEDED TO ADD THIS SO THAT IT CAN ACTUALLY COMPARE RESULTS FOR EACH CLASS AND CLASSIFY CORRECTLY!
    #adamax = optimizers.Adamax(lr=learning_rate);
    #model.compile(loss='binary_crossentropy', #categorical_crossentropy
    #              optimizer=adamax,#'adadelta',
    #              metrics=['accuracy'])
    print ('summary:')
    print(model.summary())
    # TEMPDIS FOR LINUX
    #plot_model(model, show_shapes=True, to_file=architectureDir+'/'+modelName.split('.')[0]+'.png')
    #os.system('open '+architectureDir+'/'+modelName.split('.')[0]+'.png')

    #fin = model.fit(x_train, y_train, callbacks=callbacks,batch_size=batch, epochs=n_epochs,shuffle=True)
    #score ,acc = model.evaluate(x_test, y_test, batch_size=batch)
    #print ('test loss: '+str(score)+', test acc:'+str(acc))

    obj = open(architecturePath, 'w')
    obj.write(model.to_json())
    obj.close()
    return architecturePath

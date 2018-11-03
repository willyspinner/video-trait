# NOTE: This file will be deleted : it's useless.
from keras import optimizers
from keras.models import model_from_json
from keras.callbacks import ReduceLROnPlateau

callbacks=[ReduceLROnPlateau(monitor='accuracy', factor=0.2,
                              patience=3, min_lr=0.001)]

class ML_model:
    #initialise.
    def __init__(self,architecture, weights=None):
    #load architecture:
        f = open(architecture, "r")
        self.model =model_from_json(f.read())
          #Load the existing lstm architecture
        f.close()
        #get weights:
        if (weights is not None):
            #load existing weights. Catch error if incompatible just in case.
            self.model.load_weights(weights)


    def offline_train(self,x_train,y_train,batch=20,n_epochs = 35,learning_rate = 0.16):
        adamax = optimizers.Adamax(lr=learning_rate);
        self.model.compile(loss='binary_crossentropy', #categorical_crossentropy
                      optimizer=adamax,#'adadelta',
                      metrics=['accuracy'])
        self.model.fit(x_train, y_train, callbacks=callbacks,batch_size=batch, epochs=n_epochs,shuffle=True)
    #start training with X Y numpy arrays. Re-initialize weights back to origin if weights already present.


    def evaluate(self,x_test,y_test,batch=20):
    #return metrics for evaluation.
        adamax = optimizers.Adamax(lr=0.01);
        self.model.compile(loss='binary_crossentropy', #categorical_crossentropy
                          optimizer=adamax,#'adadelta',
                          metrics=['accuracy'])
        score ,acc = self.model.evaluate(x_test, y_test, batch_size=batch)
        return {'score':score,'acc':acc}

    def predict(self,x): # predict one. returns Numpy array(s) of predictions.
        if weights is None:
            return 'ERROR: weights not loaded.'
        else:
            return model.predict(x)

    def save_weights(self,path):
        self.model.save_weights(path)
    #save the weights for future use.


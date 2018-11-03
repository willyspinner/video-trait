# How to train and run the nn backend.


```sh
$ python3 train.py 
  # outputs to stdout: absolute paths for architecture and weight respectively.
  /root/projects/blabla/arch-192afefba.json
  /root/projects/blabla/weight-104fe941b.json
$ python3 app.py /root/projects/blabla/arch-192afefba.json /root/projects/blabla/weight-104fe941b.json
```

Alternatively, to make it a one time thing, just pipe the train to the app. 
```sh
$ python3 train.py | python3 app.py
```

Or, if you want to specify a custom weight and arch, specify it as env vars.
```sh
$ NN_WEIGHT="/a/b/c/weight.json" NN_ARCH="/a/b/c/arch.json" python3 app.py
```


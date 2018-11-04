train-dev:
	source bin/activate && ENVIRON="dev" python3 train.py
train-prod:
	source bin/activate && ENVIRON="production" python3 train.py
run-dev:
	source bin/activate && ENVIRON="dev" python3 app.py ml_model/architectures/lstm.json ml_model/weights/lstm-weights.h5
run-prod:
	source bin/activate && ENVIRON="production" python3 app.py ml_model/architectures/lstm.json ml_model/weights/lstm-weights.h5
clean-vectorized:
	[ -e dataset/mbti_1_vectorized_X.h5 ] && [ -e dataset/mbti_1_vectorized_Y.h5 ] && rm dataset/mbti_1_vectorized_X.h5 && rm dataset/mbti_1_vectorized_Y.h5
clean-model:
	rm ml_model/architectures/lstm.json ; rm ml_model/weights/lstm-weights.h5


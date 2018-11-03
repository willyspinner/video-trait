# We have 2 services.
- web backend - handles youtube API, processes Video and GCP time-series labelling of the videos, and relays this to nn backend.
- nn backend - w2v vectorize the time-series labels, and return a meyer-briggs prediction.

### NN backend

#### routes
- `POST /analyze`
  - Body:
    - `words` : (array of words and labels of the video / reddit data)



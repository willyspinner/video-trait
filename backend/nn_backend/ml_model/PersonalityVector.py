import numpy as np
"""
prefix: ES EN IS IN
suffix: TJ TP FP FJ 
"""
total = 8675
weighings = {
        0: 39 /total ,
        1: 89 / total,
        2: 48 / total,
        3: 42 / total,
        4: 231 / total,
        5: 685 / total,
        6: 675 /  total,
        7: 190 / total,
        8: 205 / total,
        9: 337 / total,
        10: 271 / total,
        11: 166 / total,
        12: 1091 / total,
        13: 1304 / total,
        14: 1832 / total,
        15: 1470 / total
    }
arr = [a+b for a in ["ES","EN","IS","IN"] for b in ["TJ","TP","FP","FJ"]]
def output_0_ne_idx(i, idx):
    if idx != i:
        return 0
    else:
        return 1

def get_class_weights():
    return weighings


def to_personality(npClassVector):
    maxIdx= 0
    max=0
    oneIdx = 0
    for i in range(npClassVector.shape[1]):
        if npClassVector[0,i] > max:
            maxIdx = i
            max= npClassVector[0,i]
       # return highest confidence
    return arr[maxIdx]







def to_numpy_class_vector(personality):
    prefix = personality[:2]
    suffix = personality[2:]
    idx = 0
    if len(suffix) != 2:
        print("ERROR - personality has more than 4 letters:",personality)
        exit(1)
    try:
        idx = arr.index(prefix+suffix)
    except:
        print("ERROR - personality Doesn't exist:", personality)
        exit(1)
    return np.array([output_0_ne_idx(x, idx) for x in range(16)])







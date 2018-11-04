import numpy as np
"""
prefix: total /ES EN IS IN
suffix: total /TJ TP FP FJ 
"""
total = 8675
weighings = {
    # the heavier the weight, the more they are under represented.
        0: total / 39 ,
        1: total /  89,
        2: total /48  ,
        3: total /  42,
        4: total /231  ,
        5: total /685  ,
        6: total /675   ,
        7: total /190  ,
        8: total /205  ,
        9: total /337  ,
        10: total /271  ,
        11: total /166  ,
        12: total /1091  ,
        13: total /1304  ,
        14: total /1832  ,
        15: total /1470
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







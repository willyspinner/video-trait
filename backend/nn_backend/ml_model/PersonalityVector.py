import numpy as np
def output_0_ne_idx(i, idx):
    if idx != i:
        return 0
    else:
        return 1

def to_numpy_class_vector(personality):
    arr = []
    """
    prefix: ES EN IS IN 
    suffix: TJ TP FP FJ 
    """
    prefix = personality[:2]
    suffix = personality[2:]
    if len(suffix) != 2:
        print("ERROR - personality has more than 4 letters:",personality)
        exit(1)
    multiplier_4 = -1
    unit = -1
    if prefix == "ES":
        multiplier_4 = 3
    elif prefix == "EN":
        multiplier_4 = 2
    elif prefix == "IS":
        multiplier_4 = 1
    elif prefix == "IN":
        multiplier_4 = 0
    if suffix == "TJ":
        unit = 3
    elif suffix == "TP":
        unit = 2
    elif suffix == "FP":
        unit = 1
    elif suffix == "FJ":
        unit = 0
    if multiplier_4 == -1 or unit == -1:
        print("ERROR - personality has invalid qualifiers:",personality)
        exit(1)
    idx = (multiplier_4 * 4) + unit
    return np.array([output_0_ne_idx(x, idx) for x in range(16)])







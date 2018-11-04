#!/usr/bin/env sh
# analyze weights and normalize with data value.
PREFIXES=( ES EN IS IN )
SUFFIXES=( TJ TP FP FJ )
IDX=0
SUM=0
for a in "${PREFIXES[@]}"; do
    for b in "${SUFFIXES[@]}"; do
        VAL="$(cat mbti_1.csv | cut -c1-4|grep "$a$b" | wc -l )"
        (( SUM = $SUM + $VAL ))
        #echo "$a$b : $VAL"
        echo "$IDX : $VAL,"
        (( IDX = $IDX + 1 ))
    done
done
echo "sum : $SUM"

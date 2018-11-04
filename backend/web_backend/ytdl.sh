#!/bin/bash

url=$1
youtube-dl -f "worst"  --no-check-certificate --youtube-skip-dash-manifest --external-downloader aria2c "${url}" -o - | ffmpeg -i pipe:0 -vf fps=1/60 img%03d.jpg

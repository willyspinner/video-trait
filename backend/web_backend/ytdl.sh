#!/bin/bash

video_id=$1
youtube-dl -f "worst"  --no-check-certificate --youtube-skip-dash-manifest  "http://youtube.com/watchv=?${video_id}" -o - | ffmpeg -i pipe:0 -vf fps=1/60 "$(pwd)/frames/img-${video_id}-%03d.jpg"
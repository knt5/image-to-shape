#!/bin/bash

#===========================================================
# draw rect

ocr="works/004-ocr"
in="works/001-gray"
out="works/005-no-chars"

mkdir -p "$out"

node convert-2.js

#===========================================================
# remove tiny noise









#===========================================================
# morph

in="works/003-binarize"
out="works/006-morph"

mkdir -p "$out"

\ls "$in" | while read file
do
	convert -morphology Erode Square:1.5 "$in/$file" "$out/$file"
done

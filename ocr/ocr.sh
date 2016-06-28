#!/bin/bash

#===========================================================
# OCR
in="../works/002-resize"
out="../works/005-ocr"

mkdir -p "$out"

\ls "$in" | while read file
do
	name=`basename "$file" .png`
	tesseract "$in/$file" "$out/$name" -l jpn japanese.config makebox
	mv "$out/$name".box "$out/$name".txt
done

#===========================================================
# Draw rect

ocr="../works/005-ocr"
in="../works/001-gray"
out="../works/006-no-chars"

mkdir -p "$out"

node ocr.js

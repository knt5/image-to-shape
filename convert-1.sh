#!/bin/bash

#===========================================================
# Gray scale

in="images"
out="works/001-gray"

mkdir -p "$out"

\ls "$in" | while read file
do
	# Remove extention
	name=`basename "$file" .jpg`
	name=`basename "$name" .gif`
	name=`basename "$name" .png`
	
	# Convert
	#  Do NOT use: convert -type GrayScale "$in/$file" "$out/$file"
	convert -modulate 100,0 "$in/$file" "$out/$name".png
done

#===========================================================
# Resize

in="works/001-gray"
out="works/001b-resize"

mkdir -p "$out"

\ls "$in" | while read file
do
	size=`identify "$in/$file" | awk '{print $3}'`
	width=`echo $size | awk -Fx '{print $1}'`
	height=`echo $size | awk -Fx '{print $2}'`
	converted=0
	convertedSize=600
	
	if [ $width -ge $height ]
	then
		if [ $width -gt $convertedSize ]
		then
			convert -resize ${convertedSize}x "$in/$file" "$out/$file"
			converted=1
		fi
	else
		if [ $height -gt $convertedSize ]
		then
			convert -resize x${convertedSize} "$in/$file" "$out/$file"
			converted=1
		fi
	fi
	
	if [ $converted -eq 0 ]
	then
		cp "$in/$file" "$out/$file"
	fi
done


#===========================================================
# blur

in="works/001b-resize"
out="works/002-blur"

mkdir -p "$out"

\ls "$in" | while read file
do
	#convert -gaussian-blur 1x0.5 "$in/$file" "$out/$file"
	#convert -gaussian-blur 1x0.75 "$in/$file" "$out/$file"
	convert -gaussian-blur 1x0.88 "$in/$file" "$out/$file"
done

#===========================================================
# binarize

in="works/002-blur"
out="works/003-binarize"

mkdir -p "$out"

\ls "$in" | while read file
do
	#convert -threshold 21759 "$in/$file" "$out/$file"
	convert -threshold 19000 "$in/$file" "$out/$file"
done

#===========================================================
# OCR
in="works/001b-resize"
out="works/004-ocr"

mkdir -p "$out"

\ls "$in" | while read file
do
	name=`basename "$file" .png`
	tesseract "$in/$file" "$out/$name" -l jpn japanese.config makebox
	mv "$out/$name".box "$out/$name".txt
done

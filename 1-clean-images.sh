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
out="works/002-resize"

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
# Blur

in="works/002-resize"
out="works/003-blur"

mkdir -p "$out"

\ls "$in" | while read file
do
	#convert -gaussian-blur 1x0.5 "$in/$file" "$out/$file"
	#convert -gaussian-blur 1x0.75 "$in/$file" "$out/$file"
	convert -gaussian-blur 1x0.88 "$in/$file" "$out/$file"
done

#===========================================================
# Binarize

in="works/003-blur"
out="works/004-binarize"

mkdir -p "$out"

\ls "$in" | while read file
do
	#convert -threshold 21759 "$in/$file" "$out/$file"
	convert -threshold 19000 "$in/$file" "$out/$file"
done

#===========================================================
# Remove noise

in="works/004-binarize"
out="works/007-denoise"

mkdir -p "$out"

\ls "$in" | while read file
do
	node modules/removeTinyDots.js "$in/$file" "$out/$file" 1
	node modules/removeTinyDots.js "$out/$file" "$out/$file" 1
	
	convert -morphology Open Square:1 "$out/$file" "$out/$file"
done

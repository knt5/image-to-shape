#!/bin/bash

#===========================================================
# Flip vertical

in="works/105-morph"
out="works/201-flip"

mkdir -p "$out"

\ls "$in" | while read file
do
	convert -flip "$in/$file" "$out/$file"
done

#===========================================================
# Convert to shape

in="works/201-flip"
out="works/202-shape"

mkdir -p "$out"

\ls "$in" | while read file
do
	name=`basename $file .png`
	gdal_polygonize.py -f GeoJSON "$in/$file" "$out/$name".json
done

#===========================================================
# Clean

in="works/202-shape"
out="works/203-cleaned"

mkdir -p "$out"

\ls "$in" | while read file
do
	node modules/cleanPolygons.js "$in/$file" "$out/$file"
done

#!/bin/bash

#===========================================================
# Generate shape
# (remove small area)

in="works/007-denoise"
out="works/101-shape"

mkdir -p "$out"

\ls "$in" | while read file
do
	name=`basename $file .png`
	gdal_polygonize.py -f GeoJSON "$in/$file" "$out/$name".json
done

#===========================================================
# Simplify

in="works/101-shape"
out="works/102-simplify"

mkdir -p "$out"

\ls "$in" | while read file
do
	ogr2ogr -simplify 0.1 -f GeoJSON "$out/$file" "$in/$file"
done

#===========================================================
# Remove small polygons

in="works/102-simplify"
out="works/103-cleaned"

mkdir -p "$out"

\ls "$in" | while read file
do
	node modules/cleanPolygons.js "$in/$file" "$out/$file"
done

#===========================================================
# Convert from shape to image

in="works/103-cleaned"
out="works/104-image"
srcImage="works/007-denoise/"

mkdir -p "$out"

\ls "$in" | while read file
do
	name=`basename $file .json`
	node modules/convertGeoJSONToPNG.js "$in/$file" "$out/$name".png "$srcImage/$name".png
done

#===========================================================
# Morph

in="works/104-image"
out="works/105-morph"

mkdir -p "$out"

\ls "$in" | while read file
do
	convert -morphology Erode Square:1.5 "$in/$file" "$out/$file"
done

const path = require('path');
const fs = require('fs');

//----------------------------------------------------------
// Arguments

if (process.argv.length !== 4) {
	console.error(`Usage: ${process.argv[0]} ${process.argv[1]} input_file output_file`);
	process.exit(1);
}

let inputFilePath = process.argv[2];
let outputFilePath = process.argv[3];

//----------------------------------------------------------
// Run

// Load
let json = JSON.parse('' + fs.readFileSync(inputFilePath));

// Init result
const results = {
	type: 'FeatureCollection',
	crs: json.crs,
	features: []
};

let p, g, c;
let size;
let id = 0;

for (const feature of json.features) {
	p = feature.properties;
	g = feature.geometry;
	c = feature.geometry.coordinates;
	
	// Reject type!=Polygon
	if (g.type !== 'Polygon') {
		throw new Error('Not Polygon type: ' + g.type);
	}
	
	// Skip DN:1 feature
	if (p.DN === 1) {
		continue;
	}
	
	// Get area size
	size = getPolygonAreaSize(c);
	
	// Remove small areas: Level.1
	if (size <= 20) {
		continue;
	}
	
	// Remove small areas: Level.2
	if (size <= 40 && c[0].length >= 14) {
		continue;
	}
	
	// Remove small areas: Level.3
	if (size <= 100 && c[0].length >= 40) {
		continue;
	}
	
	// Add to results
	results.features.push({
		type: 'Feature',
		properties: {
			id: id
		},
		geometry: {
			type: 'Polygon',
			coordinates: c
		}
	});
	
	id ++;
}

// Write
fs.writeFileSync(outputFilePath, JSON.stringify(results));

//----------------------------------------------------------
// Calculate polygon area size
function getPolygonAreaSize(coordinates) {
	let x, y;
	let polygonAreaSize = 0;
	let holeAreaSize = 0;
	let i;
	
	// Polygon area size
	polygonAreaSize = getRingAreaSize(coordinates[0]);
	
	// Hole area size
	for (i=1; i<coordinates.length - 1; i++) {
		holeAreaSize += getRingAreaSize(coordinates[i]);
	}
	
	return polygonAreaSize - holeAreaSize;
}

//----------------------------------------------------------
// Calculate ring area size
function getRingAreaSize(ring) {
	let i;
	let x1, y1, x2, y2;
	let s = 0;
	
	for (i=0; i<ring.length-1; i++) {
		[x1, y1] = ring[i];
		[x2, y2] = ring[i+1];
		
		s += (x1 - x2) * (y1 + y2);
	}
	
	s = Math.abs(s) / 2;
	
	return s;
}

//----------------------------------------------------------
// Get number of points
/*
function getNumberOfPoints(coordinates) {
	let ring;
	let num = 0;
	
	for (ring of coordinates) {
		num += ring.length;
	}
	
	return num;
}
*/

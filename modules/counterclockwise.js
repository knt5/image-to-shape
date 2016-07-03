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

let p, g, c;

// Load
let json = JSON.parse('' + fs.readFileSync(inputFilePath));

for (const feature of json.features) {
	p = feature.properties;
	g = feature.geometry;
	c = feature.geometry.coordinates;
	
	// Reject type!=Polygon
	if (g.type !== 'Polygon') {
		throw new Error('Not Polygon type: ' + g.type);
	}
	
	counterclockwisePolygon(c);
}

// Write
fs.writeFileSync(outputFilePath, JSON.stringify(json));

//----------------------------------------------------------
// Counterclockwise polygon
function counterclockwisePolygon(coordinates) {
	let i;
	
	for (i=0; i<coordinates.length - 1; i++) {
		if (isClockwise(coordinates[i])) {
			coordinates[i].reverse();
		}
	}
}

//----------------------------------------------------------
// Check clockwise
function isClockwise(ring) {
	let i;
	let x1, y1, x2, y2;
	let s = 0;
	
	for (i=0; i<ring.length-1; i++) {
		[x1, y1] = ring[i];
		[x2, y2] = ring[i+1];
		
		s += (x1 - x2) * (y1 + y2);
	}
	
	s /= 2;
	
	if (s < 0) {
		return true;
	} else {
		return false;
	}
}

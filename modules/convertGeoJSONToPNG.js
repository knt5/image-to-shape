const path = require('path');
const fs = require('fs');

// canvas
const Canvas = require('canvas');
const Image = Canvas.Image;

//----------------------------------------------------------
// Arguments

if (process.argv.length !== 5) {
	console.error(`Usage: ${process.argv[0]} ${process.argv[1]} input_file output_file image_file`);
	process.exit(1);
}

let inputFilePath = process.argv[2];
let outputFilePath = process.argv[3];
let imageFilePath = process.argv[4];

//----------------------------------------------------------
// Run

// Load GeoJSON
let json = JSON.parse('' + fs.readFileSync(inputFilePath));

// Load src image
const image = new Image();
image.src = fs.readFileSync(imageFilePath);
const w = image.width;
const h = image.height;

// Init canvas
const canvas = new Canvas(w, h);
const context = canvas.getContext('2d');
context.fillStyle = '#ffffff';
context.fillRect(0, 0, w, h);

// Draw
let p, g, c;
let size;
let i;

for (const feature of json.features) {
	p = feature.properties;
	g = feature.geometry;
	c = feature.geometry.coordinates;
	
	// Polygon
	context.fillStyle = '#000000';
	fillRing(c[0]);
	
	// Hole
	if (c.length > 1) {
		context.fillStyle = '#ffffff';
		
		for(i=1; i<c.length; i++) {
			fillRing(c[i]);
		}
	}
}

// Save image
const output = fs.createWriteStream(outputFilePath);
const stream = canvas.pngStream();
stream.on('data', (chunk) => {
	output.write(chunk);
});
stream.on('end', () => {
	console.log('Saved: ' + outputFilePath);
});

//----------------------------------------------------------
function fillRing(ring) {
	let i;
	
	if (ring.length < 2) {
		return;
	}
	
	context.beginPath();
	context.moveTo(ring[0][0], ring[0][1]);
	for (i=1; i<ring.length; i++) {
		context.lineTo(ring[i][0], ring[i][1]);
	}
	context.closePath();
	context.fill();
}

const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const glob = require('glob');

// canvas
const Canvas = require('canvas');
const Image = Canvas.Image;

//----------------------------------------------------------
// Arguments

if (process.argv.length !== 4) {
	console.error(`Usage: ${process.argv[0]} ${process.argv[1]} input_file output_file`);
	process.exit(1);
}

let inputFilePath = process.argv[2];
let outputFilePath = process.argv[3];

//----------------------------------------------------------
let canvas;
let context;

fs.readFile(inputFilePath, function(error, data){
	if (error) {
		throw error;
	}
	
	// Load image
	const image = new Image();
	image.src = data;
	
	// Init canvas
	canvas = new Canvas(image.width, image.height);
	context = canvas.getContext('2d');
	
	// Draw
	context.drawImage(image, 0, 0, image.width, image.height);
	
	// Save
	const output = fs.createWriteStream(outputFilePath);
	const stream = canvas.pngStream();
	stream.on('data', (chunk) => {
		output.write(chunk);
	});
	stream.on('end', () => {
		console.log('Saved: ' + outputFilePath);
	});
});

//----------------------------------------------------------

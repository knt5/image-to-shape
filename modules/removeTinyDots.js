const path = require('path');
const fs = require('fs');

// canvas
const Canvas = require('canvas');
const Image = Canvas.Image;

//----------------------------------------------------------
// Arguments

if (process.argv.length !== 5) {
	console.error(`Usage: ${process.argv[0]} ${process.argv[1]} input_file output_file dot_num_border`);
	process.exit(1);
}

let inputFilePath = process.argv[2];
let outputFilePath = process.argv[3];
let dotNumBorder = parseInt(process.argv[4]);

//----------------------------------------------------------
// Run

fs.readFile(inputFilePath, function(error, data) {
	if (error) {
		throw error;
	}
	
	// Load image
	const image = new Image();
	image.src = data;
	
	// Init canvas
	const canvas = new Canvas(image.width, image.height);
	
	// Remove tiny dots
	removeTinyDots(canvas, image);
	
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
function removeTinyDots(canvas, image) {
	const context = canvas.getContext('2d');
	
	// Draw
	context.drawImage(image, 0, 0, image.width, image.height);
	
	// Get image data
	const data = context.getImageData(0, 0, image.width, image.height).data;
	
	// Generate tiny dots map
	let x, y;
	let aroundDots;
	const tinyDots = [];
	for (y=0; y<image.height; y++) {
		tinyDots.push([]);
		for (x=0; x<image.width; x++) {
			tinyDots[y].push(false);
			
			if (getDotColor(x, y, data, image) === 0) {
				if (isTinyDot(getAroundDots(x, y, data, image))) {
					tinyDots[y][x] = true;
				}
			}
		}
	}
	
	// Paint white dots
	context.fillStyle = '#ffffff';
	for (y=0; y<image.height; y++) {
		for (x=0; x<image.width; x++) {
			if (tinyDots[y][x]) {
				context.fillRect(x, y, 1, 1);
			}
		}
	}
}

//----------------------------------------------------------
function getDotColor(x, y, data, image) {
	return data[(y * image.width + x) * 4];
}

//----------------------------------------------------------
function getAroundDots(x, y, data, image) {
	const aroundDots = [];
	let i;
	
	for (i=0; i<8; i++) {
		aroundDots.push(255);
	}
	
	// Around dots
	// 0 1 2
	// 3 x 4
	// 5 6 7
	
	// top
	if (x > 0 && y > 0) {
		aroundDots[0] = data[((y-1) * image.width + (x-1)) * 4];
	}
	if (y > 0) {
		aroundDots[1] = data[((y-1) * image.width + (x)) * 4];
		if (x < image.width - 1) {
			aroundDots[2] = data[((y-1) * image.width + (x+1)) * 4];
		}
	}
	
	// middle
	if (x > 0) {
		aroundDots[3] = data[((y) * image.width + (x-1)) * 4];
	}
	if (x < image.width - 1) {
		aroundDots[4] = data[((y) * image.width + (x+1)) * 4];
	}
	
	// bottom
	if (y < image.height - 1) {
		if (x > 0) {
			aroundDots[5] = data[((y+1) * image.width + (x-1)) * 4];
		}
		aroundDots[6] = data[((y+1) * image.width + (x)) * 4];
		if (x < image.width - 1) {
			aroundDots[7] = data[((y+1) * image.width + (x+1)) * 4];
		}
	}
	
	return aroundDots;
}

//----------------------------------------------------------
function isTinyDot(aroundDots) {
	let dotCount = 0;
	for (i=0; i<8; i++) {
		if (i === 1 || i === 3 || i === 4 || i === 6) {
			if (aroundDots[i] === 0) {
				dotCount ++;
			}
		}
	}
	if (dotCount <= dotNumBorder) {
		return true;
	}
	return false;
}

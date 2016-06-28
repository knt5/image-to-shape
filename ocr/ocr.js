const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const glob = require('glob');

// config
const inDir = '../works/004-binarize';
const outDir = '../works/006-no-chars';
const ocrDir = '../works/005-ocr';

// files
const names = [];
const files = glob.sync(`${ocrDir}/*.txt`);

for (const file of files) {
	let name = path.basename(file, '.txt');
	
	let imageInfo = '' + execSync(`identify ${inDir}/${name}.png`);
	let width, height;
	[width, height] = imageInfo.split(' ')[2].split('x');
	
	let contents = '' + fs.readFileSync(`${ocrDir}/${name}.txt`);
	let lines = contents.split('\n');
	let cmd = '';
	let drawOptions = '';
	let columns;
	let char;
	let x1, y1, x2, y2;
	
	for (const line of lines) {
		if (line.length > 0) {
			columns = line.split(' ');
			char = columns[0];
			x1 = parseInt(columns[1], 10);
			y1 = height - parseInt(columns[2], 10);
			x2 = parseInt(columns[3], 10);
			y2 = height - parseInt(columns[4], 10);
			
			if (char !== '~' && x2 - x1 !== 0 && y2 - y1 !== 0) {
				drawOptions += ` -draw "fill-opacity 0 rectangle ${x1},${y1} ${x2},${y2}"`;
			}
		}
	}
	
	cmd = 'convert -stroke red ' + drawOptions + ` ${inDir}/${name}.png ${outDir}/${name}.png`
	
	console.log(cmd);
	execSync(cmd);
}

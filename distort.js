const fs = require("fs");
const rl = require("readline-sync");
const path = require("path");

const MAX_ERRORS = 50;
const MAX_NAME_ITTERATION = 3;

const imageToBase64 = (filePath) => {
    if (fs.statSync(filePath).isFile()) {
        return fs.readFileSync(path.resolve(filePath)).toString('base64');
    }
    return null;
};

const distortImage = (data) => {
	let errors = Math.round(Math.random() * MAX_ERRORS);
	data.replace(/^data:([A-Za-z-+\/]+);base64,(.+)$/, "");

	for(let i = 0; i < errors; i++){
		let l = 1000 + Math.round(Math.random() * (data.length - 1002)); 
		data = data.substr(0,l) + data.charAt(l+1) + data.charAt(l) + data.substr(l+2);
	}
	return data;
}

const randInt = (min, max) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor( Math.random() * (max - min) ) + min;
};

const main = () => {
	let imagePath, imageName, imageExt;

	let filePath = rl.question("Enter image path> ");
	let maxErrors = parseInt(rl.question("Enter maximum errors> ")) || MAX_ERRORS;
	imageName = path.basename(filePath);
	imageExt = path.extname(imageName);
	imagePath = filePath.replace(imageName, "");
	imageName = imageName.replace(imageExt, "");

	let data = imageToBase64(imagePath + imageName + imageExt);
	let distortedImage = distortImage(data);

	let suffix = "";

	for ( let i=0; i<MAX_NAME_ITTERATION; i++ ) {
		filePath = imagePath + imageName + "_distorted" + ( suffix ? ( "_" + suffix ) : "") + imageExt;
		if ( fs.existsSync(filePath) )
			suffix = String(randInt(1000, 9999));
		else break;
	}

	fs.writeFile(filePath, Buffer.from(distortedImage, 'base64'), (err) => {
		if (err)
			console.error("Unable to save!", err);
	});
};
main();

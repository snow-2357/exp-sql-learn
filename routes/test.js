const fs = require("fs");

const imageFilePath = "./image.jpg";
const binaryImageData = fs.readFileSync(imageFilePath);

console.log(binaryImageData);

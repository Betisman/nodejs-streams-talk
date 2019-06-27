const fs = require('fs');
const zlib = require('zlib');

const inputFile = fs.readFileSync('./input/sample.txt');
const outputFile = fs.createWriteStream('output/data.txt');

const { createBigFile } = require('./helpers/helperCreateBigFile');

const progressBar = () => {
  const inStream = fs.createReadStream('./output/data.txt');
  const outStream = fs.createWriteStream('./output/data.txt.zz');
  inStream
    .pipe(zlib.createGzip())
    .on('data', () => process.stdout.write('.'))
    .pipe(outStream)
    .on('finish', () => console.log('Done'));
};

createBigFile(inputFile, outputFile, 3e6)
  .then(progressBar)
  .catch(console.log);

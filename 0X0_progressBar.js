const fs = require('fs');
const zlib = require('zlib');
const inStream = fs.createReadStream('output/data.txt')
const outStream = fs.createWriteStream('output/data.txt.zz')

inStream
  .pipe(zlib.createGzip())
  .on('data', () => process.stdout.write('.'))
  .pipe(outStream)
  .on('finish', () => console.log('Done'));

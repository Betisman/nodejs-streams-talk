const fs = require('fs');
const readableStream = fs.createReadStream('./input/sample.txt');
const writableStream = fs.createWriteStream('./output/uppercase.txt');
const { Transform } = require('stream');

const toUpperStream = new Transform({
  transform(chunk, encoding, cb) {
    this.push(chunk.toString().toUpperCase());
    cb();
  }
});

readableStream.setEncoding('utf8');

readableStream.pipe(toUpperStream).pipe(writableStream);
readableStream.pipe(toUpperStream).pipe(process.stdout);

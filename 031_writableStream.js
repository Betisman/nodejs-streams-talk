const fs = require('fs');
const readableStream = fs.createReadStream('input/airports.csv');
const writableStream = fs.createWriteStream(`output/${Date.now()}_airports.csv`);

let chunks = 0;

readableStream.setEncoding('utf8');

readableStream.on('data', function (chunk) {
  chunks++;
  writableStream.write(chunk);
});

readableStream.on('end', () => console.log(`onEnd: ${chunks} chunks`))

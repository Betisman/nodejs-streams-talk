const fs = require('fs');
const readableStream = fs.createReadStream('./input/SP1.csv');
let data = '';
let chunk;
let chunks = 0;

readableStream.on('readable', function () {
  while ((chunk = readableStream.read()) != null) {
    data += chunk;
  }
});

readableStream.on('end', function () {
  console.log(data)
});
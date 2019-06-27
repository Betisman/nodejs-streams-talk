const fs = require('fs');
const readableStream = fs.createReadStream('./input/sample.txt');
let data = '';
let chunks = 0;

readableStream.on('data', function (chunk) {
  chunks++;
  data += chunk;
});

readableStream.on('end', function () {
  console.log(data);
  console.log(`${chunks} chunks`)
});

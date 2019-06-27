const fs = require('fs');
const readableStream = fs.createReadStream('./input/airports.csv');
let data = '';
let chunks = 0;

readableStream.on('data', function (chunk) {
  chunks++;
  console.log(`chunk #${chunks}`);
  if (chunks % 100 === 0) console.log(`chunk ${chunks}: ${chunk}`);
  data += chunk;
});

readableStream.on('end', function () {
  // console.log(data);
  console.log(`${chunks} chunks`)
});
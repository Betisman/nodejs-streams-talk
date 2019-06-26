const fs = require('fs');
const timestamp = Date.now()
const readableStream = fs.createReadStream('./input/airports.csv');
const writableStream = fs.createWriteStream(`./output/${timestamp}_airports.csv`);

readableStream.pipe(writableStream);

// log to warn about the ending and the file created
readableStream.on('end', () => console.log(`Created file: ./output/${timestamp}_airports.csv`));

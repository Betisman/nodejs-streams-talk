const { Readable } = require('stream');

let data = '';

const readableStream = new Readable({
  read() { }
});

readableStream.push('1234567890');
readableStream.push(null); // No more data

readableStream.on('data', (chunk) => {
  console.log('data', chunk);
  data += chunk;
});

readableStream.on('end', () => console.log(data));

const { Readable } = require('stream');

let data = '';

const readableStream = new Readable({
  read(size) { }
});

readableStream.push('1234567890');
readableStream.push(null); // No more data

readableStream.on('data', (chunk) => {
  console.log('onData', chunk);
  data += chunk;
});

readableStream.on('end', () => console.log('onEnd:', data));

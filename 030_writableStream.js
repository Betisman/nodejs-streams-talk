const { Readable, Writable } = require('stream');

const readableStream = new Readable({
  read() {}
});

const writableStream = new Writable({
  write(chunk, encoding, callback) {
    console.log('write chunk:', chunk);
    callback();
  }
});

const dataToPush = '1234567890';
readableStream.push(dataToPush);
readableStream.push(null);

let chunks = 0;
readableStream.on('data', function (chunk) {
  chunks++;
  console.log(`.onData:', (${chunks}) ${chunk}`)
  writableStream.write(chunk);
});

readableStream.on('end', () => console.log(`onEnd: ${chunks} chunks`))

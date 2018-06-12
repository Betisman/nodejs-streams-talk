const { Duplex } = require('stream');

const duplex = new Duplex({
  read(size) { },
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});

process.stdin.pipe(duplex).pipe(process.stdout);

const { Duplex } = require('stream');

const duplex = new Duplex({
  read(size) { },
  write(chunk, encoding, callback) {
    console.log(`duplex read: ${chunk.toString()}`);
    this.push(chunk); // to emit the received data
    callback();
  }
});

process.stdin.pipe(duplex).pipe(process.stdout);

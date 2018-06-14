const { Duplex } = require('stream');

const duplex1 = new Duplex({
  read(size) { },
  write(chunk, encoding, callback) {
    console.log(`duplex1 read: ${chunk.toString()}`);
    this.push(chunk); // Using push, we end up calling read() emitting chunk as data
    callback();
  }
});

const duplex2 = new Duplex({
  read(size) { },
  write(chunk, encoding, callback) {
    console.log(`duplex2 read: ${chunk.toString()}`);
    this.push(chunk);
    callback();
  }
});

process.stdin.pipe(duplex1).pipe(duplex2).pipe(process.stdout);

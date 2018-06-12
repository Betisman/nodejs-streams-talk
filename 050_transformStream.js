const { Transform } = require('stream');

const toUpperStream = new Transform({
  transform(chunk, encoding, cb) {
    this.push(chunk.toString().toUpperCase());
    cb();
  }
});

process.stdin.pipe(toUpperStream).pipe(process.stdout);

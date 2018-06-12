const { Duplex } = require('stream');

const duplex = new Duplex({
  read(size) {
    this.push(String.fromCharCode(this.currentCharCode++));
    if (this.currentCharCode > 90) this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log(chunk.toString());
    callback();
  }
});

duplex.currentCharCode = 65;
process.stdin.pipe(duplex).pipe(process.stdout);


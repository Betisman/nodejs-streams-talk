const express = require('express');
const app = express();
const { Transform } = require('stream');
const csvToJsonl = require('csv-2-jsonl');
const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream('../input/closing_odds.csv');

const customStringify = () => new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    const transformed = chunk.toString();
    cb(null, transformed);
  }
});

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/stream', (req, res) => {
  csvToJsonl({ inputStream: readableStream })
    .pipe(customStringify())
    .pipe(res);
  
  readableStream
    .on('end', () => {
      res.end()
    });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

const express = require('express');
const app = express();
const { Transform } = require('stream');
const csvToJsonl = require('csv-2-jsonl');
const fs = require('fs');
const path = require('path');
const url = require('url');

const readableStream = fs.createReadStream('../input/closing_odds.csv');

const myTeam = 'Betis';
const myNationalTeam = 'Spain';
const isMyTeamPlaying = ({ home_team: homeTeam, away_team: awayTeam }, myTeam) => [homeTeam, awayTeam].includes(myTeam);
const filter = (param) => new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    const json = JSON.parse(chunk);
    const match = (isMyTeamPlaying(json, myTeam) || isMyTeamPlaying(json, myNationalTeam) || param !== 'myTeam') ? chunk : null;
    cb(null, match);
  }
})

let matches = 0;
const customStringify = () => new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    if (++matches % 1000 === 0) console.log(matches);
    const transformed = chunk.toString();
    cb(null, transformed);
  }
});

app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

const getQueryData = (req) => url.parse(req.url, true).query;
app.get('/stream', (req, res) => {
  const { q } = getQueryData(req);

  csvToJsonl({ inputStream: readableStream })
  .pipe(customStringify())
  .pipe(filter(q))
  .pipe(res);

  readableStream
    .on('end', () => {
      res.end()
    });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

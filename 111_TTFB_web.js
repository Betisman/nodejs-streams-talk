const csvParser = require('csv-parser');
const fs = require('fs');
const http = require('http');
const url = require('url');
const { Transform } = require('stream');

const { isMyTeamPlaying,
  htmlHeader,
  htmlFoot,
  toCustomMatch,
  toWebCard,
  myTeam,
  myNationalTeam } = require('./helpers/helperWebBuilding');

// Source
const readableStream = fs.createReadStream('./input/closing_odds.csv');

// Transform streams
const customMatchTransform = () => new Transform({ 
  objectMode: true,
  transform(chunk, encoding, cb) {
    const match = toCustomMatch(chunk);
    cb(null, match);
  }
});

const webCardTransform = () => new Transform({ 
  objectMode: true,
  transform(chunk, encoding, cb) {
    const match = toWebCard(chunk);
    cb(null, match + '\n');
  }
});

const filter = (param) => new Transform({ 
  objectMode: true,
  transform(chunk, encoding, cb) {
    const match = (isMyTeamPlaying(chunk, myTeam) || isMyTeamPlaying(chunk, myNationalTeam) || param !== 'myTeam') ? chunk : null;
    cb(null, match);
  }
});


const getQueryData = (req) => url.parse(req.url, true).query;

const server = http.createServer((req, res) => {
  try {
    const { q } = getQueryData(req);
    res.write(htmlHeader);

    readableStream
      .pipe(csvParser())
      .pipe(customMatchTransform())
      .pipe(filter(q))
      .pipe(webCardTransform())
      .pipe(res)

    // Closing the html
    readableStream
      .on('end', () => {
        res.write(htmlFoot)
        res.end()
      });
  } catch (err) {
    console.log(err)
  }
});
console.log('Listening on port 8000 --> http://localhost:8000');
server.listen(8000);

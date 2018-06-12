const csvParser = require('csv-parser');
const fs = require('fs');
const http = require('http');
const url = require('url');
const { Transform } = require('stream');
const MongoClient = require('mongodb').MongoClient;

// MongoDB find functions
const find = (db) => db.find({});
const findDocuments = (db) => {
  const collection = db.collection(entityName);
  const stream = find(collection).stream();
  return stream;
};

// Config
const myTeam = 'Betis';
const myNationalTeam = 'Spain'
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'local';
const entityName = 'closing_odds';

// Functions to build HTML + CSS
const isMyTeamPlaying = (match, myTeam) => (match.homeTeam === myTeam || match.awayTeam === myTeam);
const classMyTeam = match => isMyTeamPlaying(match, myTeam) ? ' myTeam' : isMyTeamPlaying(match, myNationalTeam) ? ' myNationalTeam' : '';
const specialDates = ['2008-06-29', '2010-07-11', '2012-07-01', '2005-06-11'];
const classSpecial = match => (specialDates.indexOf(match.date) > -1 && (isMyTeamPlaying(match, myTeam) || isMyTeamPlaying(match, myNationalTeam))) ? ' special' : '';
const toWebCard = match => `
  <div class="row match ${classMyTeam(match)} ${classSpecial(match)}">
    <div class="cell">${match.date}</div>
    <div class="cell">${match.league}</div>
    <div class="cell">${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}</div>
  </div>`;

const css = `
  .match { font-size: 1em; font-family: Arial; } 
  .myTeam { background: lightgreen; } .myTeam .cell { border-color: green; } 
  .myNationalTeam { background: lightcoral; } .myNationalTeam .cell { border-color: darkred; }
  .special { background: gold; } .special .cell { border-color: goldenrod; }
  #container { display: table; border-collapse: separate; border-spacing: 2px;}
  .row { display: table-row; }
  .cell { display: table-cell; padding: 3px 10px; border: 1px solid black; margin: 3px auto; }
  `;
const htmlHeader = `<!DOCTYPE html><html><head><style type="text/css">${css}</style></head><body><div id="container" style="width: 100%">`;
const htmlFoot = '</div></body><script type="text/javascript"></script></html>';

// Function to manage different sources
const toCustomMatch = match => ({
  date: match.match_date,
  league: match.league,
  homeTeam: match.home_team,
  homeScore: match.home_score,
  awayTeam: match.away_team,
  awayScore: match.away_score,
});


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
  console.log('res')
  try {
    const { q } = getQueryData(req);
    res.write(htmlHeader);

    MongoClient.connect(dbUrl)
      .then(client => {
        const db = client.db(dbName);
        console.log(db)
        return db;
      })
      .then(db => findDocuments(db))
      .then(mongoStream => {
        mongoStream
          // .pipe(csvParser())
          .pipe(customMatchTransform())
          .pipe(filter(q))
          .pipe(webCardTransform())
          .pipe(res);

        // Closing the html
        mongoStream
          .on('end', () => {
            res.write(htmlFoot)
            res.end()
          });
      })
      .catch(console.log)
  } catch (err) {
    console.log('error.....', err)
  }
});
console.log('Listening on port 8000');
server.listen(8000);

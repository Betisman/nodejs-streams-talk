const csvParser = require('csv-parser');
const fs = require('fs');
const http = require('http');
const url = require('url');
const { Transform } = require('stream');
const MongoClient = require('mongodb').MongoClient;

const { isMyTeamPlaying,
  htmlHeader,
  htmlFoot,
  toCustomMatch,
  toWebCard,
  myTeam,
  myNationalTeam } = require('./helpers/helperWebBuilding');

// Config
const dbUrl = 'mongodb://localhost:27017';
const dbName = 'streams';
const entityName = 'closing_odds';

// MongoDB find functions
const find = (db) => db.find({});
const findDocuments = (db) => {
  const collection = db.collection(entityName);
  const stream = find(collection).stream();
  return stream;
};

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

const logStream = () => new Transform({
  objectMode: true,
  transform(chunk, encoding, cb) {
    console.log(chunk);
    cb(null, chunk);
  }
})

const getQueryData = (req) => url.parse(req.url, true).query;

const server = http.createServer((req, res) => {
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
        console.log('mongo stream')
        mongoStream
          .pipe(logStream())
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

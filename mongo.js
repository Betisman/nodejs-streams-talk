const http = require('http');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'local';
const entityName = 'closing_odds';

const find = (db) => db.find({});

const findDocuments = (db) => {
  const collection = db.collection(entityName);
  const stream = find(collection).stream();
  return stream;
};

MongoClient.connect(url)
  .then(client => {
    const db = client.db(dbName);
    console.log(db)
    return db;
  })
  .then(db => findDocuments(db))
  .then(stream => {
    let counter = 0;
    stream.on('data', (doc) => {
      counter++;
      console.log(doc)
    });
    stream.on('error', (error) => console.error(error));

    stream.on('end', () => {
      console.info('mongo stream ended');
    });
  })
  .catch(err => console.log(err))


//   console.log('Connected successfully to server');
//   const db = client.db(dbName);
//   findDocuments(db, () => {
//     console.log('CLOSING')
//     client.close()
//   });
// });



const server = http.createServer((req, res) => {
  console.log('request');
  res.end()
});
server.listen(8000);

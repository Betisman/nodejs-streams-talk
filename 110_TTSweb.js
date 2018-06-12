const fs = require('fs');
const http = require('http');

const fileMatchesOrig = fs.readFileSync('./input/closing_odds.csv');
const fileMatches = fileMatchesOrig.toString();

const server = http.createServer((req, res) => {
  try {
    res.end(fileMatches);
  } catch (err) {
    console.log('error.....', err)
  }
});
console.log('Listening on port 8001');
server.listen(8001);

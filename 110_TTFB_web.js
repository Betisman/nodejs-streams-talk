const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  try {
    const fileMatchesOrig = fs.readFileSync('./input/closing_odds.csv');
    const fileMatches = fileMatchesOrig.toString();
    res.end(fileMatches);
  } catch (err) {
    console.log(err)
  }
});
console.log('Listening on port 8001 -> http://localhost:8001');
server.listen(8001);

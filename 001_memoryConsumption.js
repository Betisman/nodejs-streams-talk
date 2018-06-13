const fs = require('fs');
const http = require('http');

const inputFile = fs.readFileSync('./input/simple_input.txt');
const outputFile = fs.createWriteStream('output/data.txt');

const { createBigFile } = require('./helperCreateBigFile');

const startServer = () => {
  const server = http.createServer((req, res) => {
    fs.readFile(__dirname + '/output/data.txt', (err, data) => {
      res.end(data);
    })
  });
  console.log('Memory consumption example server listening on port 8000');
  server.listen(8000);
};

createBigFile(inputFile, outputFile, 1.4e6)
  .then(startServer)
  .catch(err => console.log(err));

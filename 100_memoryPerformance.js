const fs = require('fs');
const http = require('http');

const inputFile = fs.readFileSync('./input/simple_input.txt');
const outputFile = fs.createWriteStream('output/data.txt');

const { createBigFile } = require('./helperCreateBigFile');

const startServers = () => {
  const server = http.createServer((req, res) => {
    fs.readFile(__dirname + '/output/data.txt', (err, data) => {
      res.end(data);
    })
  });
  console.log('Memory consumption example server listening on port 8000');
  server.listen(8000);


  const server2 = http.createServer((req, res) => {
    const stream = fs.createReadStream(__dirname + '/output/data.txt');
    stream.pipe(res);
  });
  console.log('Stream example server listening on port 8001');
  server2.listen(8001);
};

createBigFile(inputFile, outputFile, 1.4e6)
  .then(startServers)
  .catch(err => console.log(err));

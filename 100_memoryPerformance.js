const fs = require('fs');
const http = require('http');

const inputFile = fs.readFileSync('./input/simple_input.txt');
const outputFile = fs.createWriteStream('output/data.txt');

const numOfTimes = 3e6;

const createBigFile = (inputFile, outputFile) => new Promise((resolve, reject) => {
  for (let i = 0; i <= numOfTimes; i++) {
    if (i % 10000 == 0) console.log(`${(i * 100 / numOfTimes).toFixed(2)}% -- ${i}`);
    outputFile.write(inputFile);
  }
  outputFile.on('error', reject);
  resolve();
});

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

createBigFile(inputFile, outputFile)
  .then(startServers)
  .catch(err => console.log(err));

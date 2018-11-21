const createBigFile = (inputFile, outputFile, numOfTimes = 1.4e6) => 
  new Promise((resolve, reject) => {
    for (let i = 0; i <= numOfTimes; i++) {
      if (i % 10000 == 0) console.log(`${(i * 100 / numOfTimes).toFixed(2)}% -- ${i}`);
      outputFile.write(inputFile);
    }
    outputFile.on('error', reject);
    resolve();
});

module.exports = {
  createBigFile,
};

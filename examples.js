const http = require('http');
const fs = require('fs');

const createBigFile = () => {
  const file = fs.createWriteStream('output/data.txt');
  for (let i = 0; i <= 1e6; i++) {
    file.write('Con el arte que te sobra, con la gente que quiere en el tiempo y la memoria manque pierda blanco y verde. Corazón que late fuerte, sentimiento que desborda, tradición que desde siempre es motivo de tu gloria. Ole, ole, ole ole, Betis olé. Ole, ole, ole, ole, Betis olé. Ole, ole, ole, Betis. Ole, ole, Betis. Ole, ole, ole, ole, Betis olé. Tu corazón ya tiene un siglo, siente el calor de la afición que está contigo. Ole, ole, ole ole, Betis olé. Ole, ole, ole, ole, Betis olé. Ole, ole, ole, Betis. Ole, ole, Betis. Ole, ole, ole, ole, Betis olé. Mucho más que un sentimiento, mucho más que una bandera, muchás que todo eso, más allá de la frontera, siempre habrá alguien que diga ¡Viva el Betis manque pierda! Y así sonarán los sones Al Final de la Palmera. Ole, ole, ole ole, Betis olé. Ole, ole, ole, ole, Betis olé. Ole, ole, ole, Betis. Ole, ole, Betis. Ole, ole, ole, ole, Betis olé. \n');
  }
  file.end();
}
createBigFile();

const server = http.createServer((req, res) => {
  fs.readFile(__dirname + '/output/data.txt', (err, data) => {
    res.end(data);
  })
});
server.listen(8000);


const server2 = http.createServer((req, res) => {
  const stream = fs.createReadStream(__dirname + '/output/data.txt');
  stream.pipe(res);
});
server2.listen(8001);





/*
Official documentation: http://nodejs.org/api/streams.html
stream-handbook https://github.com/substack/stream-handbook
A good basic introduction from SitePoint http://www.sitepoint.com/basics-node-js-streams
stream-adventure https://github.com/substack/stream-adventure
*/

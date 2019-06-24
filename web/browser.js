const button = document.getElementById('myButton')
button.addEventListener('click', process);

const myTeams = ['Betis'];
const myNationalTeams = ['Spain'];
const specialDates = ['2008-06-29', '2010-07-11', '2012-07-01', '2005-06-11'];

const isMyTeamPlaying = (match, myTeams) => (myTeams.includes(match.home_team) || myTeams.includes(match.away_team));
const classMyTeam = match => isMyTeamPlaying(match, myTeams) ? ' myTeam' : isMyTeamPlaying(match, myNationalTeams) ? ' myNationalTeam' : '';
const classSpecial = match => (specialDates.includes(match.date) && (isMyTeamPlaying(match, myTeams) || isMyTeamPlaying(match, myNationalTeams))) ? ' special' : '';
let matches = 0;
const toWebCard = match => `
  <div class="row match ${classMyTeam(match)} ${classSpecial(match)}">
    <div class="cell">${++matches}</div>
    <div class="cell">${match.match_date}</div>
    <div class="cell">${match.league}</div>
    <div class="cell">${match.home_team} ${match.home_score} - ${match.away_score} ${match.away_team}</div>
  </div>`;

function parseJSON() {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(JSON.parse(chunk));
    }
  });
}

function splitStream(splitOn) {
  let buffer = '';
  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(splitOn);
      parts.slice(0, -1).forEach(part => controller.enqueue(part));
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      if (buffer) controller.enqueue(buffer);
    }
  });
}

const domParser = new DOMParser();
const toWebCardStream = () => new TransformStream({
  transform(chunk, controller) {
    const webCard = toWebCard(chunk);
    controller.enqueue(webCard)
  }
});

function toDOM() {
  return new WritableStream({
    write(chunk) {
      return new Promise((resolve, reject) => {
        let result = domParser.parseFromString(chunk, 'text/html').body.firstChild;
        document.getElementById('container').appendChild(result);
        document.getElementById('matchCounter').innerText = `${matches} matches loaded`;
        resolve();
      })
    }
  });
}

async function process() {
  const response = await fetch('/stream');

  response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(splitStream('\n'))
    .pipeThrough(parseJSON())
    .pipeThrough(toWebCardStream())
    .pipeTo(toDOM());
}

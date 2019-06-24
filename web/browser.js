const button = document.getElementById('myButton')
button.addEventListener('click', processAll);

const favouritesButton = document.getElementById('myFavouriteButton')
favouritesButton.addEventListener('click', processFavourites);

const myTeams = ['Betis'];
const myNationalTeams = ['Spain'];
const specialDates = ['2008-06-29', '2010-07-11', '2012-07-01', '2005-06-11'];

const isMyTeamPlaying = (match, myTeams) => (myTeams.includes(match.home_team) || myTeams.includes(match.away_team));
const classMyTeam = match => isMyTeamPlaying(match, myTeams) ? ' myTeam' : isMyTeamPlaying(match, myNationalTeams) ? ' myNationalTeam' : '';
// const classSpecial = match => (specialDates.includes(match.match_date) && (isMyTeamPlaying(match, myTeams) || isMyTeamPlaying(match, myNationalTeams))) ? ' special' : '';
const classSpecial = match => specialDates.includes(match.match_date) && (isMyTeamPlaying(match, myTeams) || isMyTeamPlaying(match, myNationalTeams)) ? ' special' : '';
let matches = 0;
const toWebCard = match => `
  <div class="row match ${classMyTeam(match)} ${classSpecial(match)}">
    <div class="cell">${++matches}</div>
    <div class="cell">${match.match_date}</div>
    <div class="cell">${match.league}</div>
    <div class="cell">${match.home_team} ${match.home_score} - ${match.away_score} ${match.away_team}</div>
  </div>`;

const parseJSON = () => new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(JSON.parse(chunk));
  }
});

const splitStream = (delimiter) => {
  let buffer = '';
  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(delimiter);
      parts.slice(0, -1).forEach(part => controller.enqueue(part));
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      if (buffer) controller.enqueue(buffer);
    }
  });
};

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

function processAll() {
  process('/stream');
}
function processFavourites () {
  process('/stream?q=myTeam');
}
async function process(url) {
  const response = await fetch(url);

  response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(splitStream('\n'))
    .pipeThrough(parseJSON())
    .pipeThrough(toWebCardStream())
    .pipeTo(toDOM());
}

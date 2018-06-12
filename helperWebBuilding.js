// Config
const myTeam = 'Betis';
const myNationalTeam = 'Spain'

const specialDates = ['2008-06-29', '2010-07-11', '2012-07-01', '2005-06-11'];
const classMyTeam = match => isMyTeamPlaying(match, myTeam) ? ' myTeam' : isMyTeamPlaying(match, myNationalTeam) ? ' myNationalTeam' : '';
const classSpecial = match => (specialDates.indexOf(match.date) > -1 && (isMyTeamPlaying(match, myTeam) || isMyTeamPlaying(match, myNationalTeam))) ? ' special' : '';
const toWebCard = match => `
  <div class="row match ${classMyTeam(match)} ${classSpecial(match)}">
    <div class="cell">${match.date}</div>
    <div class="cell">${match.league}</div>
    <div class="cell">${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}</div>
  </div>`;

const css = `
  .match { font-size: 1em; font-family: Arial; } 
  .myTeam { background: lightgreen; } .myTeam .cell { border-color: green; } 
  .myNationalTeam { background: lightcoral; } .myNationalTeam .cell { border-color: darkred; }
  .special { background: gold; } .special .cell { border-color: goldenrod; }
  #container { display: table; border-collapse: separate; border-spacing: 2px;}
  .row { display: table-row; }
  .cell { display: table-cell; padding: 3px 10px; border: 1px solid black; margin: 3px auto; }
  `;

const isMyTeamPlaying = (match, myTeam) => (match.homeTeam === myTeam || match.awayTeam === myTeam);
const htmlHeader = `<!DOCTYPE html><html><head><style type="text/css">${css}</style></head><body><div id="container" style="width: 100%">`;
const htmlFoot = '</div></body><script type="text/javascript"></script></html>';

const toCustomMatch = match => ({
  date: match.match_date,
  league: match.league,
  homeTeam: match.home_team,
  homeScore: match.home_score,
  awayTeam: match.away_team,
  awayScore: match.away_score,
});

module.exports = {
  isMyTeamPlaying,
  htmlHeader,
  htmlFoot,
  toCustomMatch,
  toWebCard,
  myTeam,
  myNationalTeam,
};

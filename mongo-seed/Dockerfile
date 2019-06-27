FROM mongo

COPY ./closing_odds.csv ./closing_odds.csv
CMD mongoimport --host mongodb --db streams --collection closing_odds --type csv --file ./closing_odds.csv --headerline

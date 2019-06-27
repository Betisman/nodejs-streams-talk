mongo:
	@echo "Copying csv to mongo folder"
	cp ./input/closing_odds.csv ./mongo-seed/
	docker-compose up
	rm ./mongo-seed/closing_odds.csv

clean:
	rm -rf output/*
	rm -rf mongo-seed/closing_odds.csv

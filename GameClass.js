class Game {
    constructor(homeTeam, awayTeam, playerList) {


        this.homeTeam = homeTeam;
        setHTML("venueBoost", "Stadium Bowling Rating: " + homeTeam.homeAdvantage);
        this.awayTeam = awayTeam;
        this.playLog = [];
        this.scorecard = {};
        for (let i = homeTeam.battingLineup.length - 1; i >= 0; i--) {
            this.scorecard["player" + homeTeam.battingLineup[i]] = {
                "playerID": homeTeam.battingLineup[i],
                "ballsBowled": 0,
                "runsConceded": 0,
                "foursConceded": 0,
                "sixesConceded": 0,
                "dotsBowled": 0,
                "widesBowled": 0,
                "wickets": 0,
                "ballsFaced": 0,
                "runsScored": 0,
                "fallOfWicket": "NA",
                "foursScored": 0,
                "sixesScored": 0
            }
        }
        for (let i = awayTeam.battingLineup.length - 1; i >= 0; i--) {
            this.scorecard["player" + awayTeam.battingLineup[i]] = {
                "playerID": awayTeam.battingLineup[i],
                "ballsBowled": 0,
                "runsConceded": 0,
                "foursConceded": 0,
                "sixesConceded": 0,
                "dotsBowled": 0,
                "widesBowled": 0,
                "wickets": 0,
                "ballsFaced": 0,
                "runsScored": 0,
                "fallOfWicket": "NA",
                "foursScored": 0,
                "sixesScored": 0
            }
        }
        this.innings = 1;
        this.gameSimming = true;
        this.overs = 0;
        this.balls = 0;
        if (this.flipCoin()) {
            this.addToPlayLog(homeTeam.teamName + " wins toss!")
            this.bowlingTeam = homeTeam;
            this.battingTeam = awayTeam;
        } else {
            this.addToPlayLog(awayTeam.teamName + " wins toss!")
            this.battingTeam = homeTeam;
            this.bowlingTeam = awayTeam;
        }
        if (this.flipCoin()) {
            this.addToPlayLog(this.bowlingTeam.teamName + " chooses to bowl first")
        } else {
            this.addToPlayLog(this.bowlingTeam.teamName + " chooses to bat first")
            this.tempVar = this.bowlingTeam;
            this.bowlingTeam = this.battingTeam;
            this.battingTeam = this.tempVar;
        }
        this.scorecardTeam1 = this.battingTeam;
        this.scorecardTeam2 = this.bowlingTeam;
        this.scorecardHTML();
    }
    flipCoin() {
        return (Math.random() > 0.5)
    }
    getPlayer(id) {
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].playerID == id) {
                return playerList[i];
            }

        }
    }
    addToPlayLog(play) {
        this.playLog.push(play);
    }
    addToScorecard(play, runs, bowler, batter) {
        let batterStats = this.scorecard["player" + batter];
        let bowlerStats = this.scorecard["player" + bowler];
        if (play == "D") {
            batterStats.ballsFaced++;
            bowlerStats.ballsBowled++;
            bowlerStats.dotsBowled++;
        }
        if (play == "W") {
            batterStats.ballsFaced++;
            bowlerStats.ballsBowled++;
            batterStats.fallOfWicket = this.overs + "." + (this.balls + 1);
            bowlerStats.wickets++;
        }
        if (play == "WD") {
            bowlerStats.runsConceded += runs;
            bowlerStats.widesBowled += runs;
        }
        if (play == "LB") {
            batterStats.ballsFaced++;
            bowlerStats.ballsBowled++;
        }
        if (play == "R") {
            batterStats.ballsFaced++;
            bowlerStats.ballsBowled++;
            batterStats.runsScored += runs;
            bowlerStats.runsConceded += runs;
        }
        if (play == "B") {
            batterStats.ballsFaced++;
            bowlerStats.ballsBowled++;
            batterStats.runsScored += runs;
            bowlerStats.runsConceded += runs;
            if (runs == 4) {
                batterStats.foursScored++;
                bowlerStats.foursConceded++;
            }
            if (runs == 6) {
                batterStats.sixesScored++;
                bowlerStats.sixesConceded++;
            }
        }
    }

    runGame() {
        this.batters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.batterUp = 0;
        this.score = 0;
        this.wickets = 0;
        document.getElementById("team1Name").innerHTML = this.battingTeam.teamName;
        document.getElementById("team2Name").innerHTML = this.bowlingTeam.teamName;
        while (this.overs < 20 && this.batters.length > 1) {
            let batterID = this.battingTeam.battingLineup[this.batters[this.batterUp]];
            let bowlerID = this.bowlingTeam.bowlingOrder[this.overs];
            this.runPlay(this.getPlayer(batterID), this.getPlayer(bowlerID), 1 + (this.homeTeam.homeAdvantage - 1) / 2);
            this.balls++;
            if (this.balls > 5) {
                this.overs++;
                this.addToPlayLog(`<b> End of over ${this.overs} ${this.score}/${this.wickets}</b>`);
                this.balls = 0;
                this.batterUp = (this.batterUp+1)%2;
            }
        }
        this.innings1Score = this.score;
        this.innings1Wickets = this.wickets;
        this.innings1Balls = this.overs * 6 + this.balls;
        this.tempVar = this.bowlingTeam;
        this.bowlingTeam = this.battingTeam;
        this.battingTeam = this.tempVar;
        this.batters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.batterUp = 0;
        this.score = 0;
        this.wickets = 0;
        this.innings = 2;
        this.overs = 0;
        this.balls = 0;
        while (this.overs < 20 && this.batters.length > 1 && this.innings1Score >= this.score) {

            let batterID = this.battingTeam.battingLineup[this.batters[this.batterUp]];
            let bowlerID = this.bowlingTeam.bowlingOrder[this.overs];
            this.runPlay(this.getPlayer(batterID), this.getPlayer(bowlerID), 1 + (this.homeTeam.homeAdvantage - 1) / 2);
            this.balls++;
            if (this.balls > 5) {
                this.overs++;
                this.addToPlayLog(`<b> End of over ${this.overs} ${this.score}/${this.wickets}</b>`);
                this.balls = 0;
                this.batterUp = (this.batterUp+1)%2
            }
        }
        this.scorecard["gameResult"] = {
            "homeBattingLineup": this.homeTeam.battingLineup,
            "awayBattingLineup": this.awayTeam.battingLineup,
            "inning1BattingTeam": this.bowlingTeam.teamID,
            "inning2BattingTeam": this.battingTeam.teamID,
            "inning1RunsScored": this.innings1Score,
            "inning1BallsFaced": this.innings1Balls,
            "inning1Wickets": this.innings1Wickets,
            "inning2RunsScored": this.score,
            "inning2BallsFaced": (this.balls + this.overs * 6),
            "inning2Wickets": this.wickets
        }

        setHTML("team1Score", this.innings1Score + "/" + this.innings1Wickets);
        setHTML("team2Score", this.score + "/" + this.wickets);
        this.savePlayerStats();
        setHTML("mvp", "Man of the Match: " + this.maxPlayerName);
        document.getElementById("matchScore").classList.add("border");
        while (this.score == this.innings1Score) {

            this.tempVar = this.bowlingTeam;
            this.bowlingTeam = this.battingTeam;
            this.battingTeam = this.tempVar;
            this.batters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            this.batterUp = 0;
            this.score = 0;
            this.wickets = 0;
            this.innings = 3;
            this.overs = 19;
            this.balls = 0;
            while (this.overs < 20 && this.batters.length > 9) {

                let batterID = this.battingTeam.battingLineup[this.batters[this.batterUp]];
                let bowlerID = this.bowlingTeam.bowlingOrder[this.overs];
                this.runPlay(this.getPlayer(batterID), this.getPlayer(bowlerID), 1 + (this.homeTeam.homeAdvantage - 1) / 2);
                this.balls++;
                if (this.balls > 5) {
                    this.overs++;
                    this.addToPlayLog(`<b> End of over ${this.overs} ${this.score}/${this.wickets}</b>`);
                    this.balls = 0;
                }
            }
            this.innings1Score = this.score;
            this.tempVar = this.bowlingTeam;
            this.bowlingTeam = this.battingTeam;
            this.battingTeam = this.tempVar;
            this.batters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            this.batterUp = 0;
            this.score = 0;
            this.wickets = 0;
            this.innings = 3;
            this.overs = 19;
            this.balls = 0;
            while (this.overs < 20 && this.batters.length > 9 && this.innings1Score >= this.score) {

                let batterID = this.battingTeam.battingLineup[this.batters[this.batterUp]];
                let bowlerID = this.bowlingTeam.bowlingOrder[this.overs];
                this.runPlay(this.getPlayer(batterID), this.getPlayer(bowlerID), 1 + (this.homeTeam.homeAdvantage - 1) / 2);
                this.balls++;
                if (this.balls > 5) {
                    this.overs++;
                    this.addToPlayLog(`<b> End of over ${this.overs} ${this.score}/${this.wickets}</b>`);
                    this.balls = 0;
                }
            }
            if (this.score > this.innings1Score) {
                this.scorecard["gameResult"]["superOver"] = 2;
            } else {
                this.scorecard["gameResult"]["superOver"] = 1;
            }
        }

    }
    runPlay(batter, bowler, homeAdvantage) {
            homeAdvantage = homeAdvantage;
            let balls = `<b>${this.overs}.${this.balls+1}:</b>`;
            let playIntro = `(${bowler.name} to ${batter.name})`;
            //playTypeOdds = [wideOdds,legByeOdds,noBallOdds,battingRunOdds,wicketOdds,dotBallOdds]
            let playTypeOdds = [0.03182, 0.016400675, 0.003987089, 0.604390266, 0.039336044, 0.29569238];
            let overFactor = (((this.overs + 1 / 20) / 20) + 3) / 3;
            let ppFactor = 0.9;
            if(this.overs<6){
                ppFactor = 1.2;
            }
            let clutchFactor = Math.pow(((bowler.clutch+1) / 110), Math.pow((this.overs / 20), 5));
            let fatigueFactor = 1;
            /*  if (superOver) {
                  clutchFactor = (bowler.clutch / 100);
                  overFactor = 1.5;
              }*/
            playTypeOdds[0] = clutchFactor * playTypeOdds[0] * (Math.pow((batter.battingIQ / 100.0), 1) * (50 / (bowler.accuracy+1)));
            playTypeOdds[2] = (1 / homeAdvantage) * playTypeOdds[2] * (50 / (bowler.accuracy+1));
            playTypeOdds[3] = (1 / homeAdvantage) * 0.9 * (1 / clutchFactor) * overFactor * playTypeOdds[3] * Math.pow(((batter.timing * 0.7) + batter.battingIQ * 0.3) / (bowler.economy + 0.01), 0.8);
            /*if (lastBallNoBall) {
                battingRuns = 1.5 * battingRuns;
                lastBallNoBall = false;
            }*/

            playTypeOdds[4] = ppFactor* Math.pow(homeAdvantage, 0.5) * clutchFactor * fatigueFactor * overFactor * playTypeOdds[4] * Math.pow(((50 + (bowler.wicketTaking - 50) / 2) / ((batter.battingIQ * 0.5) + (batter.timing * 0.4) + (batter.power * 0.1))), 0.7);
            playTypeOdds[5] = clutchFactor * homeAdvantage * (1 / overFactor) * playTypeOdds[5] * Math.pow((bowler.economy + 1) / ((batter.timing * 0.7) + (batter.battingIQ * 0.3)), 0.5);
            playTypeOdds = turnIntoProbabilityMatrix(playTypeOdds);
            let playResult = playTypeOdds.length - 1;
            let playDeterminer = Math.random();

            for (let i = playTypeOdds.length - 1; i >= 0; i--) {
                if (playTypeOdds[i] > playDeterminer) {
                    playResult = i;
                }
            }

            //Wide
            if (playResult == 0) {
                let wideResult = 3;
                let wideOdds = [0.939525, 0.982078, 0.990774, 0, 1]
                let wideDeterminer = Math.random();
                for (let i = wideOdds.length - 1; i >= 0; i--) {
                    if (wideOdds[i] > wideDeterminer) {
                        wideResult = i;
                    }
                }
                this.score += wideResult + 1;
                this.addToPlayLog(`${balls} ${playIntro} ${wideResult+1} wide runs`);
                this.addToScorecard("WD", wideResult + 1, bowler.playerID, batter.playerID);
                this.batterUp = (wideResult + this.batterUp) % 2;
                this.balls--;

            }
            //LegBye
            else if (playResult == 1) {
                let legByeResult = 4;
                let legByeOdds = [0.870957, 0.917944, 0.923732, 0.998638367, 1];
                let legByeDeterminer = Math.random();
                for (let i = legByeOdds.length - 1; i >= 0; i--) {
                    if (legByeOdds[i] > legByeDeterminer) {
                        legByeResult = i
                    }
                }
                this.score += legByeResult + 1;
                this.addToPlayLog(`${balls} ${playIntro} ${legByeResult+1} leg bye runs`);
                this.addToScorecard("LB", legByeResult + 1, bowler.playerID, batter.playerID);
                this.batterUp = (legByeResult + this.batterUp + 1) % 2;
            }
            //NoBall
            else if (playResult == 2) {
                this.score += 1;
                this.addToPlayLog(`${balls} ${playIntro} NO BALL`);
                this.balls--;
            }
            //BattingRuns
            else if (playResult == 3) {
                let battingRunsBoundaryOdds = 0.263894;
                let runningRunsOdds = [0.84764, 0.144, 0.007369, 0, 0.000991];
                let boundaryOdds = ppFactor*Math.pow((1 / homeAdvantage), 0.5) * battingRunsBoundaryOdds * Math.pow(((((50 + (batter.power - 50) / 2 + 1) / 50) + (50 / (bowler.economy + 1))) / 2), 0.1);
                let battingRuns6Odds = 0.286044;
                if (Math.random() > boundaryOdds) {
                    runningRunsOdds[0] = runningRunsOdds[0] * (50 / (batter.running + 1));
                    runningRunsOdds = turnIntoProbabilityMatrix(runningRunsOdds);
                    let runningRunsResult = 3;
                    let runningRunsDeterminer = Math.random();
                    for (let i = runningRunsOdds.length; i >= 0; i--) {
                        if (runningRunsOdds[i] > runningRunsDeterminer) {
                            runningRunsResult = i
                        }
                    }
                    this.score += runningRunsResult + 1;
                    this.addToPlayLog(`${balls} ${playIntro} ${runningRunsResult+1} runs`);
                    this.addToScorecard("R", runningRunsResult + 1, bowler.playerID, batter.playerID);
                    this.batterUp = (runningRunsResult + this.batterUp + 1) % 2;
                } else {
                    let battingRuns6Number = Math.pow((1 / homeAdvantage), 0.5) * battingRuns6Odds * Math.pow((((batter.power / 50) + (50 / bowler.economy)) / 2), 0.5);
                    if (Math.random() > battingRuns6Number) {
                        this.score += 4;
                        this.addToScorecard("B", 4, bowler.playerID, batter.playerID);
                        this.addToPlayLog(`${balls} ${playIntro} FOUR!`);
                    } else {
                        this.score += 6;
                        this.addToPlayLog(`${balls} ${playIntro} SIX!`);
                        this.addToScorecard("B", 6, bowler.playerID, batter.playerID);
                    }

                }
            }
            //Wickets
            else if (playResult == 4) {
                this.wickets++;
                this.addToPlayLog(`${balls} ${playIntro} WICKET!`);
                this.batters.splice(this.batterUp, 1);
                this.addToScorecard("W", 0, bowler.playerID, batter.playerID);

            }
            //DotBall
            else if (playResult == 5) {
                this.addToPlayLog(`${balls} ${playIntro} dot ball`);
                this.addToScorecard("D", 0, bowler.playerID, batter.playerID);
            }



        }
        //NEED TO FIX SCORECARD IS BUGGING
    scorecardHTML() {
        setHTML("batting1ScorecardTitle", this.scorecardTeam1.teamName + " Batting");
        setHTML("bowling2ScorecardTitle", this.scorecardTeam1.teamName + " Bowling");
        setHTML("batting2ScorecardTitle", this.scorecardTeam2.teamName + " Batting");
        setHTML("bowling1ScorecardTitle", this.scorecardTeam2.teamName + " Bowling");
        let battingScorecard1 = "<table class='battingScorecard'>"
        battingScorecard1 += "<tr><th>Name</th><th>R</th><th>B</th><th>SR</th><th>W</th><th>4s</th><th>6s</th></tr>";
        for (i = 0; i < this.scorecardTeam1.battingLineup.length; i++) {
            let batter = this.scorecard["player" + this.scorecardTeam1.battingLineup[i]];
            battingScorecard1 += "<tr>";
            battingScorecard1 += tableCell("<button onclick=viewPlayerStats(" + batter.playerID + ")>" + this.getPlayer(batter.playerID).name + "</button>");
            battingScorecard1 += tableCell(batter.runsScored);
            battingScorecard1 += tableCell(batter.ballsFaced);
            batter.strikeRate = Math.floor(100 * (batter.runsScored / batter.ballsFaced));
            if (Number.isNaN(batter.strikeRate)) {
                battingScorecard1 += tableCell("DNB");
            } else {
                battingScorecard1 += tableCell(batter.strikeRate);
            }
            battingScorecard1 += tableCell(batter.fallOfWicket);
            battingScorecard1 += tableCell(batter.foursScored);
            battingScorecard1 += tableCell(batter.sixesScored);
            battingScorecard1 += "</tr>";

        }
        battingScorecard1 += "</table>";

        let battingScorecard2 = "<table class='battingScorecard'>"
        battingScorecard2 += "<tr><th>Name</th><th>R</th><th>B</th><th>SR</th><th>W</th><th>4s</th><th>6s</th></tr>";
        for (i = 0; i < this.scorecardTeam2.battingLineup.length; i++) {
            let batter = this.scorecard["player" + this.scorecardTeam2.battingLineup[i]];
            battingScorecard2 += "<tr>";
            battingScorecard2 += tableCell("<button onclick=viewPlayerStats(" + batter.playerID + ")>" + this.getPlayer(batter.playerID).name + "</button>");
            battingScorecard2 += tableCell(batter.runsScored);
            battingScorecard2 += tableCell(batter.ballsFaced);
            batter.strikeRate = Math.floor(100 * (batter.runsScored / batter.ballsFaced));
            if (Number.isNaN(batter.strikeRate)) {
                battingScorecard2 += tableCell("DNB");
            } else {
                battingScorecard2 += tableCell(batter.strikeRate);
            }
            battingScorecard2 += tableCell(batter.fallOfWicket);
            battingScorecard2 += tableCell(batter.foursScored);
            battingScorecard2 += tableCell(batter.sixesScored);
            battingScorecard2 += "</tr>";
        }
        battingScorecard2 += "</table>";
        let bowlingScorecard1 = "<table class='battingScorecard'>"
        bowlingScorecard1 += "<tr><th>Name</th><th>O</th><th>R</th><th>W</th><th>Econ</th><th>D</th><th>Wd</th><th>4s</th><th>6s</th></tr>";
        for (i = 0; i < this.scorecardTeam2.battingLineup.length; i++) {
            let bowler = this.scorecard["player" + this.scorecardTeam2.battingLineup[i]];
            if (bowler.ballsBowled > 0) {

                bowlingScorecard1 += "<tr>";
                bowlingScorecard1 += tableCell("<button onclick=viewPlayerStats(" + this.scorecardTeam2.battingLineup[i] + ")>" + this.getPlayer(this.scorecardTeam2.battingLineup[i]).name + "</button>");
                bowler.oversBowled = Math.floor(bowler.ballsBowled / 6) + "." + (bowler.ballsBowled % 6);
                bowlingScorecard1 += tableCell(bowler.oversBowled);
                bowlingScorecard1 += tableCell(bowler.runsConceded);
                bowlingScorecard1 += tableCell(bowler.wickets);
                bowler.gameEconomy = Math.floor(600 * (bowler.runsConceded / bowler.ballsBowled)) / 100;
                if (isNaN(bowler.gameEconomy)) {
                    bowler.gameEconomy = 0;
                }
                bowlingScorecard1 += tableCell(bowler.gameEconomy);
                bowlingScorecard1 += tableCell(bowler.dotsBowled);
                bowlingScorecard1 += tableCell(bowler.widesBowled);
                bowlingScorecard1 += tableCell(bowler.foursConceded);
                bowlingScorecard1 += tableCell(bowler.sixesConceded);
                bowlingScorecard1 += "</tr>";
            }
        }
        bowlingScorecard1 += "</table>";
        let bowlingScorecard2 = "<table class='battingScorecard'>"
        bowlingScorecard2 += "<tr><th>Name</th><th>O</th><th>R</th><th>W</th><th>Econ</th><th>D</th><th>Wd</th><th>4s</th><th>6s</th></tr>";
        for (i = 0; i < this.scorecardTeam1.battingLineup.length; i++) {
            let bowler = this.scorecard["player" + this.scorecardTeam1.battingLineup[i]];
            if (bowler.ballsBowled > 0) {

                bowlingScorecard2 += "<tr>";
                bowlingScorecard2 += tableCell("<button onclick=viewPlayerStats(" + this.scorecardTeam1.battingLineup[i] + ")>" + this.getPlayer(this.scorecardTeam1.battingLineup[i]).name + "</button>");
                bowler.oversBowled = Math.floor(bowler.ballsBowled / 6) + "." + (bowler.ballsBowled % 6);
                bowlingScorecard2 += tableCell(bowler.oversBowled);
                bowlingScorecard2 += tableCell(bowler.runsConceded);
                bowlingScorecard2 += tableCell(bowler.wickets);
                bowler.gameEconomy = Math.floor(600 * (bowler.runsConceded / bowler.ballsBowled)) / 100;
                if (isNaN(bowler.gameEconomy)) {
                    bowler.gameEconomy = 0;
                }
                bowlingScorecard2 += tableCell(bowler.gameEconomy);
                bowlingScorecard2 += tableCell(bowler.dotsBowled);
                bowlingScorecard2 += tableCell(bowler.widesBowled);
                bowlingScorecard2 += tableCell(bowler.foursConceded);
                bowlingScorecard2 += tableCell(bowler.sixesConceded);
                bowlingScorecard2 += "</tr>";
            }
        }
        bowlingScorecard2 += "</table>";
        document.getElementById("batting1scorecard").innerHTML = battingScorecard1;
        document.getElementById("batting2scorecard").innerHTML = battingScorecard2;
        document.getElementById("bowling1scorecard").innerHTML = bowlingScorecard1;
        document.getElementById("bowling2scorecard").innerHTML = bowlingScorecard2;

    }
    getGameScore(player) {
        let totalRunsScored = this.innings1Score + this.score;
        let totalBallsFaced = this.innings1Balls + this.balls;
        let matchStrikeRate = 100 * totalRunsScored / totalBallsFaced;
        let matchEconomy = 6 * totalRunsScored / totalBallsFaced;
        let battingScore = 0.04 * player.runsScored;
        battingScore *= Math.pow((100 * player.runsScored / player.ballsFaced) / matchStrikeRate, 0.5);
        if (isNaN(battingScore) || battingScore == Infinity) {
            battingScore = 0;
        }
        let bowlingScore = player.wickets * 0.2;
        bowlingScore += Math.pow(1 - ((6 * player.runsConceded / player.ballsBowled) / matchEconomy), 1);
        if (isNaN(bowlingScore) || bowlingScore == Infinity) {
            bowlingScore = 0;
        }
        let score = battingScore;
        if (bowlingScore != 0) {
            if (bowlingScore > battingScore) {
                score = (score / 2) + bowlingScore;
            } else {
                score += (bowlingScore / 2)
            }
        }
        return score;
    }
    savePlayerStats() {
        let maxScore = 0;
        this.maxPlayerName = "";
        for (i = 0; i < this.homeTeam.battingLineup.length; i++) {
            let batter = this.scorecard["player" + this.homeTeam.battingLineup[i]];
            let player = this.getPlayer(batter.playerID);
            let score = this.getGameScore(batter);
            if (maxScore < score) {
                maxScore = score;
                this.maxPlayerName = player.name;
            }
            console.log(batter.dotsBowled)
            player.stats.push({
                "gameID": parseInt(sessionStorage.gameNumber),
                "opponentID": this.awayTeam.teamID,
                "runs": batter.runsScored,
                "ballsFaced": batter.ballsFaced,
                "fours": batter.foursScored,
                "sixes": batter.sixesScored,
                "fallOfWicket": batter.fallOfWicket,
                "runsConceded": batter.runsConceded,
                "ballsBowled": batter.ballsBowled,
                "wickets": batter.wickets,
                "dotBallsBowled": batter.dotsBowled,
                "foursConceded": batter.foursConceded,
                "sixesConceded": batter.sixesConceded
            });
            
            if (Math.random() < ((1 / 22)*(player.age/30))) {
                     player.injury = Math.round(Math.pow(Math.random()*(player.age/30), 2) * 14);

            }
        }
        for (i = 0; i < this.awayTeam.battingLineup.length; i++) {
            let batter = this.scorecard["player" + this.awayTeam.battingLineup[i]];
            let player = this.getPlayer(batter.playerID);
            player.stats.push({
                "gameID": parseInt(sessionStorage.gameNumber),
                "opponentID": this.homeTeam.teamID,
                "runs": batter.runsScored,
                "ballsFaced": batter.ballsFaced,
                "fours": batter.foursScored,
                "sixes": batter.sixesScored,
                "fallOfWicket": batter.fallOfWicket,
                "runsConceded": batter.runsConceded,
                "ballsBowled": batter.ballsBowled,
                "wickets": batter.wickets,
                "dotBallsBowled": batter.dotsBowled,
                "foursConceded": batter.foursConceded,
                "sixesConceded": batter.sixesConceded
            });
            if (Math.random() < (1 / 25)) {
                  player.injury = Math.round(Math.pow(Math.random(), 3) * 14);

            }
        }
        for (i = 0; i < this.homeTeam.playerList.length; i++) {
            let player = this.getPlayer(this.homeTeam.playerList[i]);
            if (player.injury > 0) {
                player.injury--
            }
        }
        for (i = 0; i < this.awayTeam.playerList.length; i++) {
            let player = this.getPlayer(this.awayTeam.playerList[i]);
            if (player.injury > 0) {
                player.injury--
            }
        }
        localStorage.playerList = JSON.stringify(playerList)
        console.log(playerList)
    }

}
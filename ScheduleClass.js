console.log("Hi")
class Schedule {
    constructor(teams, stopSchedule) {
        this.stopSchedule = true;
        this.scorecards = [];
        this.matchNumber = 0;
        if(stopSchedule == true){
            return;
        }
        console.log("Hi")
        this.teamIDs = [];
        for (let i = teams.length - 1; i >= 0; i--) {
            this.teamIDs.push(teams[i].teamID);
        }

        this.schedule = [];
        let teamSchedules= [];
    if(localStorage.schedType == "ipl70"){
        while(teamSchedules.length != 70) {
        teamSchedules = [];
        for(let g=0; g<this.teamIDs.length;g++){
            for(let h = (g+1); h<this.teamIDs.length;h++){
                teamSchedules.push([h,g])
            }
        }
        let extraGamesCount = [];
        for(let i=0; i<this.teamIDs.length;i++){
            extraGamesCount.push(0)
        }
        for(let i=0; i<this.teamIDs.length; i++){
            let teamChoices = []
            for(let h=0; h<this.teamIDs.length;h++){
                if(extraGamesCount[h]<5 && h!=i){
                teamChoices.push(h);}
            }
            while(extraGamesCount[i]<5){
                teamChoices = shuffleArray(teamChoices);
                let teamAdded = teamChoices.pop();
                extraGamesCount[i] += 1;
                extraGamesCount[teamAdded] += 1;
                teamSchedules.push([this.teamIDs[i],this.teamIDs[teamAdded]]);
            }
            
        }
    }
        let homeGamesCount = [];
        for(let i=0; i<this.teamIDs.length;i++){
            homeGamesCount.push(0)
        }
        let homeGamesAllotted = false;
        let timesThrough = 0;
        while(timesThrough <100){
            timesThrough += 1;
            console.log(timesThrough)
            homeGamesAllotted = true;
            for(let i=0; i<this.teamIDs.length;i++){
                let count = 0;
                for (let g=0; g<teamSchedules.length; g++){
                    if(teamSchedules[g][0]==i){
                        count += 1;
                    }
                }
                homeGamesCount[i] = count;
                if(count <7){
                    let chosenGame = Math.floor(Math.random()*count);
                    for (let g=0; g<teamSchedules.length; g++){
                        if(teamSchedules[g][1]==i){
                            count += 1;
                            if(count == chosenGame){
                                let temp =teamSchedules[g][0];
                                let temp2 = teamSchedules[g][1];
                                teamSchedules[g] = [temp2,temp];
                            }
                        }
                    }
                }
                if(count > 7){
                    let chosenGame = Math.floor(Math.random()*count);
                    for (let g=0; g<teamSchedules.length; g++){
                        if(teamSchedules[g][0]==i){
                            count += 1;
                            if(count == chosenGame){
                                let temp =teamSchedules[g][0];
                                let temp2 = teamSchedules[g][1];
                                teamSchedules[g] = [temp2,temp];
                            }
                        }
                    }
                }
                if(count != 7){
                    homeGamesAllotted = false;
                }

            }

        }
        for(let i=0; i<100; i++){
        teamSchedules = shuffleArray(teamSchedules);
        }
        for(let i=0; i<teamSchedules.length;i++){
            teamSchedules[i] = shuffleArray(teamSchedules[i]);
            let team1 = teamSchedules[i][0];
            let team2 = teamSchedules[i][1];
            this.schedule.push({
                "homeTeam": team1,
                "awayTeam": team2
            });

        }}
        else if(localStorage.schedType == "roundRobin"){
        
        for (let i = 0; i < teams.length; i++) {
            teamSchedules.push([]);
            console.log(teamSchedules);
            for (let g = this.teamIDs.length - 1; g >= 0; g--) {
                
                let team1 = this.teamIDs[i];
                let team2 = this.teamIDs[g];
                if (team1 != team2) {
                    teamSchedules[i].push({
                        "homeTeam": team1,
                        "awayTeam": team2
                    });
                }
            }
            
            for(let h=0; h<10;h++){
            shuffleArray(teamSchedules[i]);
            }
        }

        for (let i = 0; i < teamSchedules[0].length; i++) {
            let a = randInt(0,teamSchedules.length);
            for (let g=0;g<teamSchedules.length;g++){
                this.schedule.push(teamSchedules[(g+a)%teamSchedules.length][i]);
            }
           
        } 
    }
        /*   for (let i = 0; i < this.schedule.length - 2; i++) {
               console.log(i)
               let team1 = this.schedule[i].homeTeam;
               let team2 = this.schedule[i].awayTeam;
               for (let j = 1; j < 3; j++) {
                   if (team1 == this.schedule[i + j].homeTeam || team1 == this.schedule[i + j].awayTeam || team2 == this.schedule[i + j].homeTeam || team2 == this.schedule[i + j].awayTeam) {
                       let fixSchedule = true;
                       for (let k = 1; k < this.schedule.length - i; k++) {
                           if (!(team1 == this.schedule[i + k].homeTeam || team1 == this.schedule[i + k].awayTeam || team2 == this.schedule[i + k].homeTeam || team2 == this.schedule[i + k].awayTeam)) {
                               let tempVar = this.schedule[i + j];
                               this.schedule[i + j] = this.schedule[i + k];
                               this.schedule[i + k] = this.schedule[i + j];
                               fixSchedule = false;
                               break;
                           }

                       }
                       if (fixSchedule) {
                           i = -1;
                           shuffleArray(this.schedule);
                       }
                   }

               }
           }*/
    }
    remakeSchedule(schedule) {
        this.schedule = schedule.schedule;
        console.log(this.schedule)
        this.scorecards = schedule.scorecards;
        this.teamIDs = schedule.teamIDs;
    }
    gameNumber() {
        this.gameNumber = this.scorecards.length;
    }
    makeStandings() {
        let standings = [];
        console.log("HELLLO")
        if(this.teamIDs == undefined){
            console.log("HI")
            return;
        }
        console.log("HI");
        for (let i = 0; i < this.teamIDs.length; i++) {
            standings.push({
                "teamID": i,
                "form": "",
                "runsScored": 0,
                "runsAgainst": 0,
                "ballsFaced": 0,
                "ballsAgainst": 0,
                "wins": 0,
                "losses": 0,
                "points": 0

            });
        }
        let maxGames = this.scorecards.length - 1;
        if(localStorage.schedType == "roundRobin"){
        if (maxGames > (this.teamIDs.length * (this.teamIDs.length - 1) - 1)) {
            maxGames = this.teamIDs.length * (this.teamIDs.length - 1) - 1;
        }}
        else if (localStorage.schedType == "ipl70" ){
            if (maxGames > 69) {
                maxGames = 69;
            }
        }

        for (let i = maxGames; i >= 0; i--) {
            let scorecard = this.scorecards[i];
            if (scorecard == undefined) {
                break;
            }
            let matchResult = scorecard["gameResult"];

            let team1 = 1;
            let team2 = 2;
            for (let i = standings.length - 1; i >= 0; i--) {
                if (matchResult.inning1BattingTeam == standings[i].teamID) {
                    team1 = standings[i]
                }
                if (matchResult.inning2BattingTeam == standings[i].teamID) {
                    team2 = standings[i]
                }
            }
            team1.runsScored += matchResult.inning1RunsScored;
            team1.ballsFaced += matchResult.inning1BallsFaced;
            team1.runsAgainst += matchResult.inning2RunsScored;
            team1.ballsAgainst += matchResult.inning2BallsFaced;
            team2.runsAgainst += matchResult.inning1RunsScored;
            team2.ballsAgainst += matchResult.inning1BallsFaced;
            team2.runsScored += matchResult.inning2RunsScored;
            team2.ballsFaced += matchResult.inning2BallsFaced;
            if (matchResult.inning1RunsScored > matchResult.inning2RunsScored || matchResult.superOver == 1) {
                team1.form += "W";
                team1.wins++;
                team1.points += 2;
                team2.form += "L";
                team2.losses++;

            } else {
                team1.form += "L";
                team1.losses++;
                team2.form += "W";
                team2.wins++;
                team2.points += 2;
            }

        }
        for (let i = 0; i < standings.length; i++) {
            standings[i].netRunRate = 6*((standings[i].runsScored / standings[i].ballsFaced) - (standings[i].runsAgainst / standings[i].ballsAgainst));
            if (isNaN(standings[i].netRunRate)) {
                standings[i].netRunRate = 0;
            }
            for (let h = 0; h < teams.length; h++) {
                if (teams[h].teamID == standings[i].teamID) {
                    standings[i].teamName = teams[h].teamName;
                    teams[h].wins = standings[i].wins;
                    teams[h].losses = standings[i].losses;
                    teams[h].netRunRate = Math.floor(standings[i].netRunRate * 100) / 100;
                }
            }


        }
        standings.sort((a, b) => (a.points > b.points) ? -1 : (a.points === b.points) ? ((a.netRunRate > b.netRunRate) ? -1 : 1) : 1);

        let standingsTable = "<div><table>";
        standingsTable += "<tr class='standingsHeader '><th></th><th>Team</th><th>Pld</th><th>W</th><th>L</th><th>NRR</th><th>For</th><th>Against</th><th>Pts</th><th>Form</th></tr>"
        for (let i = 0; i < standings.length; i++) {
            standingsTable += "<tr><td>#" + (i + 1) + "</td>";
            standingsTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewTeamStats(" + standings[i].teamID + ")>" + standings[i].teamName + "</button>" + "</td>";
            standingsTable += "<td>" + standings[i].form.length + "</td>";
            standingsTable += "<td>" + standings[i].wins + "</td>";
            standingsTable += "<td>" + standings[i].losses + "</td>";
            standingsTable += "<td>" + Math.floor(standings[i].netRunRate * 100) / 100 + "</td>";
            standingsTable += "<td>" + standings[i].runsScored + "/" + (Math.floor(standings[i].ballsFaced / 6)) + "." + (standings[i].ballsFaced % 6) + "</td>";
            standingsTable += "<td>" + standings[i].runsAgainst + "/" + (Math.floor(standings[i].ballsAgainst / 6)) + "." + (standings[i].ballsAgainst % 6) + "</td>";
            standingsTable += "<td>" + standings[i].points + "</td>";
            let endResult = standings[i].form.length;
            if(endResult > 5){
                endResult = 5;
            }
            standingsTable += "<td>" + standings[i].form.slice(0, endResult) + "</td>";
            standingsTable += "</tr>"
        }
        this.standings = standings;
        setHTML("standings", standingsTable)
        console.log(standingsTable)
    }
    gameLogOutput(teamID){
        this.gameNumber = this.scorecards.length;
        let scheduleOutput = "";
        if(localStorage.schedType == "ipl70"){

        for (let i = parseInt(this.gameNumber)-1; i >= 0 ; i--) {
            let matchInfo = this.scorecards[i]["gameResult"];
            if((teamID ==matchInfo["inning1BattingTeam"])||(teamID == matchInfo["inning2BattingTeam"]) ){
            let button = "</div>" + "<div class=' btn btn-block scorecard'>" + "<button class='green'" +
                " id=" + i.toString() + " onclick='scorecardClick(" + i + ")'" + ">" + "scorecard</button>";

            let matchNumber = "Match " + (i + 1);
            if (i == 70) {
                matchNumber = "Qualifier 1";
            }
            if (i == 71) {
                matchNumber = "Eliminator"
            }
            if (i == 72) {
                matchNumber = "Qualifier 2";
            }
            if (i == 73) {
                matchNumber = "Finals";
            }
            
            let result = ""
            if (matchInfo["inning1RunsScored"] > matchInfo["inning2RunsScored"]) {
                result = teams[matchInfo["inning1BattingTeam"]].teamName + " won by " + (matchInfo["inning1RunsScored"] - matchInfo["inning2RunsScored"]) + " runs";
            } else if (matchInfo["inning1RunsScored"] < matchInfo["inning2RunsScored"]) {
                result = teams[matchInfo["inning2BattingTeam"]].teamName + " won by " + (10 - matchInfo["inning2Wickets"]) + " wickets";
            } else if (matchInfo["superOver"] == 1) {
                result = teams[matchInfo["inning1BattingTeam"]].teamName + " won in Super Over";
            } else {
                result = teams[matchInfo["inning2BattingTeam"]].teamName + " won in Super Over";
            }
            scheduleOutput += "<div class = 'game'> <div class = 'matchNumber'> " + matchNumber +
                "</div> <div class = 'team1'> <div class = 'team1Name'>" +
                "<button class ='viewPlayerStats' onclick='viewTeamStats(" + matchInfo["inning1BattingTeam"] + ")'><i>" + teams[matchInfo["inning1BattingTeam"]].teamName + "</i></button>" +
                "</div>" +
                "<div class='team1Score'>" + matchInfo["inning1RunsScored"] + "/" + matchInfo["inning1Wickets"] + "</div>" +
                "<div class='team1Oversplayed'> (" + parseInt(matchInfo["inning1BallsFaced"] / 6) + "." + (matchInfo["inning1BallsFaced"] % 6) + ")</div>" +
                "</div> <div class='team2'> <div class = 'team2Name'>" +
                "<button class ='viewPlayerStats' onclick=viewTeamStats(" + matchInfo["inning2BattingTeam"] + ")><i>" + teams[matchInfo["inning2BattingTeam"]].teamName + "</i></button>" +
                "</div>" +
                "<div class='team2Score'>" + matchInfo["inning2RunsScored"] + "/" + matchInfo["inning2Wickets"] + "</div>" +
                "<div class='team2Oversplayed'>(" + parseInt(matchInfo["inning2BallsFaced"] / 6) + "." + (matchInfo["inning2BallsFaced"] % 6) + ")</div>" + "</div>" + "<div class='matchResult'>" +
                result + button +
                "</div></div>";
        };
    }
    }
    else if(localStorage.schedType == "roundRobin"){
        let numberGame = (teams.length-1)*teams.length;
        
        for (let i = parseInt(this.gameNumber)-1; i >= 0 ; i--) {
            let matchInfo = this.scorecards[i]["gameResult"];
            if((teamID ==matchInfo["inning1BattingTeam"])||(teamID == matchInfo["inning2BattingTeam"]) ){
            let button = "</div>" + "<div class=' btn btn-block scorecard'>" + "<button class='green'" +
                " id=" + i.toString() + " onclick='scorecardClick(" + i + ")'" + ">" + "scorecard</button>";

            let matchNumber = "Match " + (i + 1);
            if (i == 70) {
                matchNumber = "Qualifier 1";
            }
            if (i == 71) {
                matchNumber = "Eliminator"
            }
            if (i == 72) {
                matchNumber = "Qualifier 2";
            }
            if (i == 73) {
                matchNumber = "Finals";
            }
            
            let result = ""
            if (matchInfo["inning1RunsScored"] > matchInfo["inning2RunsScored"]) {
                result = teams[matchInfo["inning1BattingTeam"]].teamName + " won by " + (matchInfo["inning1RunsScored"] - matchInfo["inning2RunsScored"]) + " runs";
            } else if (matchInfo["inning1RunsScored"] < matchInfo["inning2RunsScored"]) {
                result = teams[matchInfo["inning2BattingTeam"]].teamName + " won by " + (10 - matchInfo["inning2Wickets"]) + " wickets";
            } else if (matchInfo["superOver"] == 1) {
                result = teams[matchInfo["inning1BattingTeam"]].teamName + " won in Super Over";
            } else {
                result = teams[matchInfo["inning2BattingTeam"]].teamName + " won in Super Over";
            }
            scheduleOutput += "<div class = 'game'> <div class = 'matchNumber'> " + matchNumber +
                "</div> <div class = 'team1'> <div class = 'team1Name'>" +
                "<button class ='viewPlayerStats' onclick='viewTeamStats(" + matchInfo["inning1BattingTeam"] + ")'><i>" + teams[matchInfo["inning1BattingTeam"]].teamName + "</i></button>" +
                "</div>" +
                "<div class='team1Score'>" + matchInfo["inning1RunsScored"] + "/" + matchInfo["inning1Wickets"] + "</div>" +
                "<div class='team1Oversplayed'> (" + parseInt(matchInfo["inning1BallsFaced"] / 6) + "." + (matchInfo["inning1BallsFaced"] % 6) + ")</div>" +
                "</div> <div class='team2'> <div class = 'team2Name'>" +
                "<button class ='viewPlayerStats' onclick=viewTeamStats(" + matchInfo["inning2BattingTeam"] + ")><i>" + teams[matchInfo["inning2BattingTeam"]].teamName + "</i></button>" +
                "</div>" +
                "<div class='team2Score'>" + matchInfo["inning2RunsScored"] + "/" + matchInfo["inning2Wickets"] + "</div>" +
                "<div class='team2Oversplayed'>(" + parseInt(matchInfo["inning2BallsFaced"] / 6) + "." + (matchInfo["inning2BallsFaced"] % 6) + ")</div>" + "</div>" + "<div class='matchResult'>" +
                result + button +
                "</div></div>";
        };
    }
}
        return scheduleOutput;
    }

    
    htmlOutput() {
        this.makeStandings();
        this.gameNumber = this.scorecards.length;
        let scheduleOutput = "";
        if(localStorage.schedType == "ipl70"){
        if (this.gameNumber == 70 && this.schedule.length == this.gameNumber) {
            this.schedule.push({
                "homeTeam": this.standings[0].teamID,
                "awayTeam": this.standings[1].teamID
            });
            this.schedule.push({
                "homeTeam": this.standings[2].teamID,
                "awayTeam": this.standings[3].teamID
            });
        }
        if (this.gameNumber == 72 && this.schedule.length == this.gameNumber) {
            let homeTeam = this.scorecards[70]["gameResult"].inning1BattingTeam;
            if (this.scorecards[70]["gameResult"].inning1RunsScored > this.scorecards[70]["gameResult"].inning2RunsScored) {
                homeTeam = this.scorecards[70]["gameResult"].inning2BattingTeam;
            }
            let awayTeam = this.scorecards[71]["gameResult"].inning2BattingTeam;
            if (this.scorecards[71]["gameResult"].inning1RunsScored > this.scorecards[71]["gameResult"].inning2RunsScored) {
                awayTeam = this.scorecards[71]["gameResult"].inning1BattingTeam;
            }
            this.schedule.push({
                "homeTeam": homeTeam,
                "awayTeam": awayTeam
            });
        }
        if (this.gameNumber == 73 && this.schedule.length == this.gameNumber) {
            let homeTeam = this.scorecards[70]["gameResult"].inning1BattingTeam;
            if (this.scorecards[70]["gameResult"].inning1RunsScored < this.scorecards[70]["gameResult"].inning2RunsScored) {
                homeTeam = this.scorecards[70]["gameResult"].inning2BattingTeam;
            }
            let awayTeam = this.scorecards[72]["gameResult"].inning2BattingTeam;
            if (this.scorecards[72]["gameResult"].inning1RunsScored > this.scorecards[72]["gameResult"].inning2RunsScored) {
                awayTeam = this.scorecards[72]["gameResult"].inning1BattingTeam;
            }
            this.schedule.push({
                "homeTeam": homeTeam,
                "awayTeam": awayTeam
            });
        }
        for (let i = parseInt(this.gameNumber); i < this.schedule.length; i++) {
            let button = "</div>" + "<div class='simMatch btn btn-block'>" + "<button class='auto' onclick='auto(" + i + ")'> Sim to Match </button>";
            if (i == this.gameNumber) {
                button = "</div>" + "<div class='simMatch btn btn-block'>" + "<button class='play nextGameMargin' onclick='nextMatchClick(" + i + ")'> Play Game</button>"
            }
            scheduleOutput += `<div class = 'game'> <div class = 'matchNumber' id="matchNumber${i+1}"> Match ${i+1} </div> <div class = 'team1'> <div class = 'team1Name'>
                <button class ='viewPlayerStats' onclick='viewTeamStats(${this.schedule[i].homeTeam})'><i> ${teams[this.schedule[i].homeTeam].teamName}</i></button>
                </div>
                </div> <div class='team2'> <div class = 'team2Name'> 
                <button class ='viewPlayerStats' onclick="viewTeamStats(${this.schedule[i].awayTeam})"> <i>${teams[this.schedule[i].awayTeam].teamName}</i></button> </div>
                </div> <div class='matchResult'> 
                ${button} 
                </div></div>`;

        };
        scheduleOutput = scheduleOutput.replace("Match 71", "Qualifier 1");
        scheduleOutput = scheduleOutput.replace("Match 72", "Eliminator 1");
        scheduleOutput = scheduleOutput.replace("Match 73", "Qualifier 2");
        scheduleOutput = scheduleOutput.replace("Match 74", "Finals");


        for (let i = 0; i < parseInt(this.gameNumber); i++) {

            let button = "</div>" + "<div class=' btn btn-block scorecard'>" + "<button class='green'" +
                " id=" + i.toString() + " onclick='scorecardClick(" + i + ")'" + ">" + "scorecard</button>";

            let matchNumber = "Match " + (i + 1);
            if (i == 70) {
                matchNumber = "Qualifier 1";
            }
            if (i == 71) {
                matchNumber = "Eliminator"
            }
            if (i == 72) {
                matchNumber = "Qualifier 2";
            }
            if (i == 73) {
                matchNumber = "Finals";
            }
            let matchInfo = this.scorecards[i]["gameResult"];
            let result = ""
            if (matchInfo["inning1RunsScored"] > matchInfo["inning2RunsScored"]) {
                result = teams[matchInfo["inning1BattingTeam"]].teamName + " won by " + (matchInfo["inning1RunsScored"] - matchInfo["inning2RunsScored"]) + " runs";
            } else if (matchInfo["inning1RunsScored"] < matchInfo["inning2RunsScored"]) {
                result = teams[matchInfo["inning2BattingTeam"]].teamName + " won by " + (10 - matchInfo["inning2Wickets"]) + " wickets";
            } else if (matchInfo["superOver"] == 1) {
                result = teams[matchInfo["inning1BattingTeam"]].teamName + " won in Super Over";
            } else {
                result = teams[matchInfo["inning2BattingTeam"]].teamName + " won in Super Over";
            }
            scheduleOutput += "<div class = 'game'> <div class = 'matchNumber'> " + matchNumber +
                "</div> <div class = 'team1'> <div class = 'team1Name'>" +
                "<button class ='viewPlayerStats' onclick='viewTeamStats(" + matchInfo["inning1BattingTeam"] + ")'><i>" + teams[matchInfo["inning1BattingTeam"]].teamName + "</i></button>" +
                "</div>" +
                "<div class='team1Score'>" + matchInfo["inning1RunsScored"] + "/" + matchInfo["inning1Wickets"] + "</div>" +
                "<div class='team1Oversplayed'> (" + parseInt(matchInfo["inning1BallsFaced"] / 6) + "." + (matchInfo["inning1BallsFaced"] % 6) + ")</div>" +
                "</div> <div class='team2'> <div class = 'team2Name'>" +
                "<button class ='viewPlayerStats' onclick=viewTeamStats(" + matchInfo["inning2BattingTeam"] + ")><i>" + teams[matchInfo["inning2BattingTeam"]].teamName + "</i></button>" +
                "</div>" +
                "<div class='team2Score'>" + matchInfo["inning2RunsScored"] + "/" + matchInfo["inning2Wickets"] + "</div>" +
                "<div class='team2Oversplayed'>(" + parseInt(matchInfo["inning2BallsFaced"] / 6) + "." + (matchInfo["inning2BallsFaced"] % 6) + ")</div>" + "</div>" + "<div class='matchResult'>" +
                result + button +
                "</div></div>";
        };
    }
    else if(localStorage.schedType == "roundRobin"){
        let numberGame = (teams.length-1)*teams.length;
        if (this.gameNumber == numberGame && this.schedule.length == this.gameNumber) {
            this.schedule.push({
                "homeTeam": this.standings[0].teamID,
                "awayTeam": this.standings[1].teamID
            });
            this.schedule.push({
                "homeTeam": this.standings[2].teamID,
                "awayTeam": this.standings[3].teamID
            });
        }
        if (this.gameNumber == (numberGame+2) && this.schedule.length == this.gameNumber) {
            let homeTeam = this.scorecards[numberGame]["gameResult"].inning1BattingTeam;
            if (this.scorecards[numberGame]["gameResult"].inning1RunsScored > this.scorecards[numberGame]["gameResult"].inning2RunsScored) {
                homeTeam = this.scorecards[numberGame]["gameResult"].inning2BattingTeam;
            }
            let awayTeam = this.scorecards[numberGame+1]["gameResult"].inning2BattingTeam;
            if (this.scorecards[numberGame+1]["gameResult"].inning1RunsScored > this.scorecards[numberGame+1]["gameResult"].inning2RunsScored) {
                awayTeam = this.scorecards[numberGame + 1]["gameResult"].inning1BattingTeam;
            }
            this.schedule.push({
                "homeTeam": homeTeam,
                "awayTeam": awayTeam
            });
        }
        if (this.gameNumber == (numberGame +3) && this.schedule.length == this.gameNumber) {
            let homeTeam = this.scorecards[numberGame]["gameResult"].inning1BattingTeam;
            if (this.scorecards[numberGame]["gameResult"].inning1RunsScored < this.scorecards[numberGame]["gameResult"].inning2RunsScored) {
                homeTeam = this.scorecards[numberGame]["gameResult"].inning2BattingTeam;
            }
            let awayTeam = this.scorecards[numberGame+2]["gameResult"].inning2BattingTeam;
            if (this.scorecards[numberGame + 2]["gameResult"].inning1RunsScored > this.scorecards[numberGame+2]["gameResult"].inning2RunsScored) {
                awayTeam = this.scorecards[numberGame + 2]["gameResult"].inning1BattingTeam;
            }
            this.schedule.push({
                "homeTeam": homeTeam,
                "awayTeam": awayTeam
            });
        }
        for (let i = parseInt(this.gameNumber); i < this.schedule.length; i++) {
            let button = "</div>" + "<div class='simMatch btn btn-block'>" + "<button class='auto' onclick='auto(" + i + ")'> Sim to Match </button>";
            if (i == this.gameNumber) {
                button = "</div>" + "<div class='simMatch btn btn-block'>" + "<button class='play nextGameMargin' onclick='nextMatchClick(" + i + ")'> Play Game</button>"
            }
            scheduleOutput += `<div class = 'game'> <div class = 'matchNumber' id="matchNumber${i+1}"> Match ${i+1} </div> <div class = 'team1'> <div class = 'team1Name'>
                <button class ='viewPlayerStats' onclick='viewTeamStats(${this.schedule[i].homeTeam})'><i> ${teams[this.schedule[i].homeTeam].teamName}</i></button>
                </div>
                </div> <div class='team2'> <div class = 'team2Name'> 
                <button class ='viewPlayerStats' onclick="viewTeamStats(${this.schedule[i].awayTeam})"> <i>${teams[this.schedule[i].awayTeam].teamName}</i></button> </div>
                </div> <div class='matchResult'> 
                ${button} 
                </div></div>`;

        };
        scheduleOutput = scheduleOutput.replace("Match 71", "Qualifier 1");
        scheduleOutput = scheduleOutput.replace("Match 72", "Eliminator 1");
        scheduleOutput = scheduleOutput.replace("Match 73", "Qualifier 2");
        scheduleOutput = scheduleOutput.replace("Match 74", "Finals");


        for (let i = 0; i < parseInt(this.gameNumber); i++) {

            let button = "</div>" + "<div class=' btn btn-block scorecard'>" + "<button class='green'" +
                " id=" + i.toString() + " onclick='scorecardClick(" + i + ")'" + ">" + "scorecard</button>";

            let matchNumber = "Match " + (i + 1);
            if (i == 70) {
                matchNumber = "Qualifier 1";
            }
            if (i == 71) {
                matchNumber = "Eliminator"
            }
            if (i == 72) {
                matchNumber = "Qualifier 2";
            }
            if (i == 73) {
                matchNumber = "Finals";
            }
            let matchInfo = this.scorecards[i]["gameResult"];
            let result = ""
            if (matchInfo["inning1RunsScored"] > matchInfo["inning2RunsScored"]) {
                result = teams[matchInfo["inning1BattingTeam"]].teamName + " won by " + (matchInfo["inning1RunsScored"] - matchInfo["inning2RunsScored"]) + " runs";
            } else if (matchInfo["inning1RunsScored"] < matchInfo["inning2RunsScored"]) {
                result = teams[matchInfo["inning2BattingTeam"]].teamName + " won by " + (10 - matchInfo["inning2Wickets"]) + " wickets";
            } else if (matchInfo["superOver"] == 1) {
                result = teams[matchInfo["inning1BattingTeam"]].teamName + " won in Super Over";
            } else {
                result = teams[matchInfo["inning2BattingTeam"]].teamName + " won in Super Over";
            }
            scheduleOutput += "<div class = 'game'> <div class = 'matchNumber'> " + matchNumber +
                "</div> <div class = 'team1'> <div class = 'team1Name'>" +
                "<button class ='viewPlayerStats' onclick='viewTeamStats(" + matchInfo["inning1BattingTeam"] + ")'><i>" + teams[matchInfo["inning1BattingTeam"]].teamName + "</i></button>" +
                "</div>" +
                "<div class='team1Score'>" + matchInfo["inning1RunsScored"] + "/" + matchInfo["inning1Wickets"] + "</div>" +
                "<div class='team1Oversplayed'> (" + parseInt(matchInfo["inning1BallsFaced"] / 6) + "." + (matchInfo["inning1BallsFaced"] % 6) + ")</div>" +
                "</div> <div class='team2'> <div class = 'team2Name'>" +
                "<button class ='viewPlayerStats' onclick=viewTeamStats(" + matchInfo["inning2BattingTeam"] + ")><i>" + teams[matchInfo["inning2BattingTeam"]].teamName + "</i></button>" +
                "</div>" +
                "<div class='team2Score'>" + matchInfo["inning2RunsScored"] + "/" + matchInfo["inning2Wickets"] + "</div>" +
                "<div class='team2Oversplayed'>(" + parseInt(matchInfo["inning2BallsFaced"] / 6) + "." + (matchInfo["inning2BallsFaced"] % 6) + ")</div>" + "</div>" + "<div class='matchResult'>" +
                result + button +
                "</div></div>";
        };
    }
        return scheduleOutput;
    }

}
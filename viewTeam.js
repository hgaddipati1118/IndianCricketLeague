let teamViewingNumber = sessionStorage.currentTeamView;
let playerList = JSON.parse(localStorage.playerList)

for (let i = playerList.length - 1; i >= 0; i--) {
    let player = createPlayer(randInt(60, 100), i);
    player.remakePlayer(playerList[i]);
    playerList[i] = player;
}
let teams = JSON.parse(localStorage.teams);

for (let i = teams.length - 1; i >= 0; i--) {
    let team = new Team(1, 1, 1, 1, 1);
    team.remakeTeam(teams[i], playerList);
    teams[i] = team;

}
console.log(teams[teamViewingNumber])
let updateTeams = () => {
    localStorage.teamRosters = JSON.stringify(teams);
}
let findPlayer = (playerID) => {
    for (i = 0; i < playerList.length; i++) {
        if (playerList[i].playerID == playerID) {
            return playerList[i];
        }
    }
}
let teamViewing = teams[teamViewingNumber];
teamViewing.autoSortBatting();
document.getElementById("venueBoost").innerHTML = "Stadium Bowling Rating: " + Math.round(100 * teamViewing.homeAdvantage) / 100;
for (let i = teamViewing.playerList.length - 1; i >= 0; i--) {
    let currentPlayer = findPlayer(teamViewing.playerList[i]);
    let runsScored = 0;
    let wickets = 0;
    let runsConceded = 0;
    let ballsBowled = 0;
    let timesOut = 0;
    let timesBatted = 0;
    let timesBowled = 0;
    let ballsFaced = 0;
    let sixes = 0;
    let fours = 0;
    let gameStats = currentPlayer.stats;
    for (let h = 0; h < gameStats.length; h++) {
        wickets += gameStats[h].wickets;
        runsScored += gameStats[h].runs;
        runsConceded += gameStats[h].runsConceded;
        ballsBowled += gameStats[h].ballsBowled;
        ballsFaced += gameStats[h].ballsFaced;
        sixes += gameStats[h].sixes;
        fours += gameStats[h].fours;

        if (gameStats[h].fallOfWicket != "NA") {
            timesOut++;
        }
        if (gameStats[h].ballsFaced != 0) {
            timesBatted++;
        }
        if (gameStats[h].ballsBowled != 0) {
            timesBowled++;
        }
    }
    if (isNaN(runsScored)) {
        runsScored = 0;
    }
    if (isNaN(wickets)) {
        wickets = 0;
    }
    currentPlayer.runsScored = runsScored;
    currentPlayer.wickets = wickets;
    currentPlayer.notOuts = timesBatted - timesOut;
    currentPlayer.inningsBatted = timesBatted;
    currentPlayer.ballsFaced = ballsFaced;
    currentPlayer.inningsBowled = timesBowled;
    currentPlayer.strikeRate = 100 * runsScored / ballsFaced;
    currentPlayer.foursScored = fours;
    currentPlayer.sixesScored = sixes;
    if (isNaN(currentPlayer.strikeRate)) {
        currentPlayer.strikeRate = 0;
    }
    if (timesOut == 0) {
        currentPlayer.battingAverage = runsScored;
    } else {
        currentPlayer.battingAverage = runsScored / timesOut
    };
    currentPlayer.runsConceded = runsConceded;
    currentPlayer.ballsBowled = ballsBowled;
    if (isNaN(currentPlayer.ballsBowled)) {
        currentPlayer.ballsBowled = 0;
    }
    if (isNaN(currentPlayer.runsConceded)) {
        currentPlayer.runsConceded = 0;
    }
    currentPlayer.bowlingAverage = runsConceded / wickets;
    if (isNaN(currentPlayer.bowlingAverage) || currentPlayer.bowlingAverage == Infinity) {
        currentPlayer.bowlingAverage = currentPlayer.runsConceded;
    }
    currentPlayer.gamesPlayed = gameStats.length;
    currentPlayer.bowlingEconomy = 6 * runsConceded / ballsBowled;
    if (isNaN(currentPlayer.bowlingEconomy)) {
        currentPlayer.bowlingEconomy = 0;
    }
    console.log(currentPlayer.runsScored)
}
let team1Players = teamViewing.playerList.map(element => element);
/*team1Players.sort(function(a, b) {
    if (findPlayer(a).overall < findPlayer(b).overall) { return 1; } else if (findPlayer(a).overall == findPlayer(b).overall) { return 0; } else { return -1; }
});*/
let numberOfInternational = 0;
for (let i = 0; i < 11; i++) {
    if (findPlayer(team1Players[i]).international) {
        numberOfInternational++;
    }
    if (numberOfInternational > 4) {
        let valueTakenOut = team1Players.map(element => element)[i];
        let replacementPlayer = 11;
        while (findPlayer(team1Players[replacementPlayer]).international) {
            replacementPlayer++;
        }
        team1Players[i] = team1Players[replacementPlayer];
        team1Players[replacementPlayer] = valueTakenOut;
    }
}
team1 = team1Players;
teamViewing.players = team1Players;
document.getElementById("teamName").innerHTML = teamViewing.teamName;
document.getElementById("gameLog").innerHTML = `<button class ='viewPlayerStats' onclick='viewGameLog()'>Game Log</button>`;
let bowlingOrderTable = () => {

    let bowlingOrderTable = "<table><tr><th> Over</th> <th>Bowler</th><th> Over</th> <th>Bowler</th><th> Over</th> <th>Bowler</th><th> Over</th> <th>Bowler</th></tr>";
    for (let h = 1; h < 6; h++) {
        bowlingOrderTable += "<tr>";
        for (let g = 0; g < 4; g++) {
            let i = (5 * g) + h;
            let name = findPlayer(teamViewing.bowlingOrder[i - 1]).name;
            let options = "<div name ='" + (i - 1) + "' id='bowlerOver" + (i - 1) +
                "'>" + name + "</div>";


            bowlingOrderTable += tableCell(i);
            bowlingOrderTable += tableCell(options);

        }
        bowlingOrderTable += "</tr>";
    }
    bowlingOrderTable += "</table>";
    document.getElementById("bowlingLineup").innerHTML = bowlingOrderTable;
}


let tables = () => {
    bowlingOrderTable();
    let newBattingLineup = teamViewing.playerList.slice(0, 11);
    newBattingLineup.sort(function(a, b) {
        if (findPlayer(a).battingOverall < findPlayer(b).battingOverall) { return 1; } else if (findPlayer(a).battingOverall == findPlayer(b).battingOverall) { return 0; } else { return -1; }
    });
    for (let i = 0; i < newBattingLineup.length; i++) {
        teamViewing.playerList[i] = newBattingLineup[i];
    }
    teamViewing.battingLineup = newBattingLineup;
    let playerInfoTable = "<table><tr><td colspan='6' class='tableMergedHeaders'>Player Info</td><td colspan='6' class='tableMergedHeaders'>Batting Stats</td><td colspan='6' class='tableMergedHeaders'>Bowling Stats</td></tr><tr><th>#</th><th>Name</th><th>Ovr</th><th>BT</th> <th>BWL</th><th>M</th><th>Inns</th><th>Runs</th><th>BF</th> <th>SR</th><th>Avr</th><th>Inns</th><th>Ovrs</th><th>Runs</th> <th>Wkts</th><th>Econ</th><th>Avr</th></tr>";
    for (let i = 0; i < teamViewing.playerList.length; i++) {
        let currentPlayer = findPlayer(teamViewing.playerList[i]);
        let asterik = "";
        if (currentPlayer.international) {
            asterik = "*";
        }
        let color = "inherit";
        if (currentPlayer.injury>0) {
            color = "red";
            console.log(color);
        }
        let injury = "";
        console.log(currentPlayer.injury)
        if (currentPlayer.injury>0) {
            injury = " (" + currentPlayer.injury+ ")";
        }
        playerInfoTable += "<tr>";
        playerInfoTable += "<td class='maxWidth'>" + (i + 1) + "</td>";
        playerInfoTable += tableCell("<button style='color:" + color + ";' class ='viewPlayerStats' onclick=viewPlayerStats(" + currentPlayer.playerID + ")>" + currentPlayer.name + asterik + injury + "</button>");

        playerInfoTable += tableCell(Math.round(currentPlayer.overall));
        playerInfoTable += tableCell(Math.round(currentPlayer.battingOverall));
        playerInfoTable += tableCell(Math.round(currentPlayer.bowlingOverall));
        playerInfoTable += tableCell(Math.round(currentPlayer.gamesPlayed));
        let average = Math.round(currentPlayer.runsScored / (currentPlayer.inningsBatted - currentPlayer.notOuts));
        if (isNaN(average) || average == Infinity) {
            average = currentPlayer.runsScored
        }

        playerInfoTable += tableCell(Math.round(currentPlayer.inningsBatted));
        playerInfoTable += tableCell(Math.round(currentPlayer.runsScored));
        playerInfoTable += tableCell(Math.round(currentPlayer.ballsFaced));
        playerInfoTable += tableCell(Math.round(currentPlayer.strikeRate));
        playerInfoTable += tableCell(Math.round(average));
        let overs = Math.floor(currentPlayer.ballsBowled / 6) + "." + (currentPlayer.ballsBowled % 6);
        if (isNaN(overs)) {
            overs = "0.0";
        }
        let economy = Math.round(600 * currentPlayer.runsConceded / currentPlayer.ballsBowled) / 100;
        if (isNaN(economy)) {
            economy = 0
        }
        let bowlingAverage = Math.round(currentPlayer.runsConceded / currentPlayer.wickets);
        if (isNaN(bowlingAverage) || bowlingAverage == Infinity) {
            bowlingAverage = currentPlayer.runsConceded;
        }
        playerInfoTable += tableCell(Math.round(currentPlayer.inningsBowled));
        playerInfoTable += tableCell(overs);
        playerInfoTable += tableCell(Math.round(currentPlayer.runsConceded));
        playerInfoTable += tableCell(Math.round(currentPlayer.wickets));
        playerInfoTable += tableCell(economy);
        playerInfoTable += tableCell(bowlingAverage);
        playerInfoTable += "</tr>";

    }
    playerInfoTable += "</table>";
    document.getElementById("playerInfo").innerHTML = playerInfoTable;

}


tables();
let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("viewteam", "viewplayerstats");
    window.location.href = url;
}

let viewGameLog = (id) => {
    console.log(id);

    let url = window.location.href;
    url = url.replace("viewteam", "viewgamelog");
    window.location.href = url;
}
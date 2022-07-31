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
console.log(sessionStorage.currentPlayerView);


let currentPlayer = "";
for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].playerID == sessionStorage.currentPlayerView) {

        currentPlayer = playerList[i];
    }
}
console.log(currentPlayer)
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
let teamName = "FA";
if(isNumber(currentPlayer.teamID)){
    teamName = teams[currentPlayer.teamID].teamName;
}
console.log(currentPlayer)
document.getElementById("playerCountry").innerHTML = "Country: " + currentPlayer.country;
document.getElementById("playerTeam").innerHTML = "Team: " + "<button class ='viewTeamStats' onclick=viewTeamStats(" + currentPlayer.teamID + ")>" + teamName+ "</button>";
document.getElementById("playerName").innerHTML = currentPlayer.name + " (" + currentPlayer.bid + " crores)";
document.getElementById("playerOverall").innerHTML = "Overall: " + Math.round(currentPlayer.overall) + currentPlayer.overallProg;
document.getElementById("playerBowlingOverall").innerHTML = "Bowling Overall: " + Math.round(currentPlayer.bowlingOverall) + currentPlayer.bowlingOverallProg;
document.getElementById("playerBattingOverall").innerHTML = "Batting Overall: " + Math.round(currentPlayer.battingOverall) + currentPlayer.battingOverallProg;
document.getElementById("playerEconomy").innerHTML = "Economy: " + Math.round(currentPlayer.economy) + currentPlayer.economyProg;
document.getElementById("playerWicketTaking").innerHTML = "Wicket Taking: " + Math.round(currentPlayer.wicketTaking) + currentPlayer.wicketTakingProg;
document.getElementById("playerAccuracy").innerHTML = "Accuracy: " + Math.round(currentPlayer.accuracy) + currentPlayer.accuracyProg;
document.getElementById("playerBattingIQ").innerHTML = "Batting IQ: " + Math.round(currentPlayer.battingIQ) + currentPlayer.battingIQProg;
document.getElementById("playerTiming").innerHTML = "Timing: " + Math.round(currentPlayer.timing) + currentPlayer.timingProg;
document.getElementById("playerPower").innerHTML = "Power: " + Math.round(currentPlayer.power) + currentPlayer.powerProg;
document.getElementById("playerRunning").innerHTML = "Running: " + Math.round(currentPlayer.running) + currentPlayer.runningProg;
document.getElementById("playerAge").innerHTML = "Age: " + Math.round(currentPlayer.age);
document.getElementById("playerClutch").innerHTML = "Clutch: " + Math.round(currentPlayer.clutch) + currentPlayer.clutchProg;
let seasonAverageTable = `<table> <tr><th colspan="9">Batting Averages</th><th colspan ="7">Bowling Averages</th></tr><tr class='battingAverageTableHeader'><th>Mat</th><th>Inns</th><th>Runs</th><th>Avg</th><th>NO</th><th>BF</th><th>SR</th><th>4s</th><th>6s</th><th>Mat</th><th>Inns</th><th>Ovrs</th><th>Runs</th><th>Wkts</th><th>Avg</th><th>Econ</th></tr>`
seasonAverageTable += "<td>" + currentPlayer.gamesPlayed + "</td>";
seasonAverageTable += "<td>" + currentPlayer.inningsBatted + "</td>";
seasonAverageTable += "<td>" + currentPlayer.runsScored + "</td>";
seasonAverageTable += "<td>" + Math.round(100 * currentPlayer.battingAverage) / 100 + "</td>";
seasonAverageTable += "<td>" + currentPlayer.notOuts + "</td>";
seasonAverageTable += "<td>" + currentPlayer.ballsFaced + "</td>";
seasonAverageTable += "<td>" + Math.round(currentPlayer.strikeRate) + "</td>";
seasonAverageTable += "<td>" + currentPlayer.foursScored + "</td>";
seasonAverageTable += "<td>" + currentPlayer.sixesScored + "</td>";
seasonAverageTable += "<td>" + currentPlayer.gamesPlayed + "</td>";
seasonAverageTable += "<td>" + currentPlayer.inningsBowled + "</td>";
seasonAverageTable += "<td>" + Math.floor(currentPlayer.ballsBowled / 6) + "." + (currentPlayer.ballsBowled % 6) + "</td>";
seasonAverageTable += "<td>" + currentPlayer.runsConceded + "</td>";
seasonAverageTable += "<td>" + currentPlayer.wickets + "</td>";
seasonAverageTable += "<td>" + Math.floor(currentPlayer.bowlingAverage * 100) / 100 + "</td>";
seasonAverageTable += "<td>" + Math.floor(100 * currentPlayer.bowlingEconomy) / 100 + "</td>";
seasonAverageTable += "</tr>";
seasonAverageTable += "</table>";
document.getElementById("seasonAverage").innerHTML = seasonAverageTable;
let matchInfo = "<table><tr><td class='mergedHeadTitle' colspan='2'> Match Info</td> <td class='mergedHeadTitle' colspan='6'> Batting Stats</td> <td class='mergedHeadTitle' colspan='5'> Bowling Stats</td></tr><tr><th>Match #</th> <th> Opponent</th><th>Runs</th><th>BF</th><th>N/O</th><th>SR</th><th>4s</th><th>6s</th><th>Ovrs</th><th>Runs</th><th>Wkts</th><th>Econ</th><th>Ds</th></tr>";
let currentSeasonStats = currentPlayer.stats;
for (let u = currentSeasonStats.length - 1; u >= 0; u--) {
    let currentGameStats = currentSeasonStats[u];
    matchInfo += "<tr>";
    matchInfo += "<td>" + "<button class ='viewMatchStats' onclick=scorecardClick(" + parseInt(currentGameStats.gameID) + ")>" + (parseInt(currentGameStats.gameID) + 1) + "</button>" + "</td>";
    matchInfo += "<td>" + "<button class ='viewTeamStats' onclick=viewTeamStats(" + currentGameStats.opponentID + ")>" + teams[currentGameStats.opponentID].teamName + "</button>"; + "</td>";
    let notOut = "N";
    if (currentGameStats.fallOfWicket == "NA") {
        notOut = "Y";
    }
    let strikeRate = Math.round(100 * currentGameStats.runs / currentGameStats.ballsFaced);
    if (isNaN(strikeRate)) {
        strikeRate = "N/A";
    }

    matchInfo += "<td>" + currentGameStats.runs + "</td>";
    matchInfo += "<td>" + currentGameStats.ballsFaced + "</td>";
    matchInfo += "<td>" + notOut + "</td>";
    matchInfo += "<td>" + strikeRate + "</td>";
    matchInfo += "<td>" + currentGameStats.fours + "</td>";
    matchInfo += "<td>" + currentGameStats.sixes + "</td>";
    let economy = Math.round(600 * currentGameStats.runsConceded / currentGameStats.ballsBowled) / 100;
    if (isNaN(economy)) {
        economy = 0;
    }
    if (currentGameStats.ballsBowled == undefined) {

        matchInfo += "<td>" + "0.0 " + "</td>";
        matchInfo += "<td>" + 0 + "</td>";
        matchInfo += "<td>" + 0 + "</td>";
        matchInfo += "<td>" + "0.00" + "</td>";
        matchInfo += "<td>" + 0 + "</td>";
        matchInfo += "</tr>";
    } else {

        matchInfo += "<td>" + Math.floor(currentGameStats.ballsBowled / 6) + "." + (currentGameStats.ballsBowled % 6) + "</td>";
        matchInfo += "<td>" + currentGameStats.runsConceded + "</td>";
        matchInfo += "<td>" + currentGameStats.wickets + "</td>";
        matchInfo += "<td>" + economy + "</td>";
        matchInfo += "<td>" + currentGameStats.dotBallsBowled + "</td>";
        matchInfo += "</tr>";
    }
    document.getElementById("matchInfo").innerHTML = matchInfo;
}


let scorecardClick = (i) => {
    sessionStorage.scorecardToView = i;
    let url = window.location.href;
    url = url.replace("viewPlayerStats", "viewOldScorecard");
    window.location.href = url;
}
let viewTeamStats = (id) => {
    sessionStorage.currentTeamView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("viewPlayerStats", "viewTeam");
    window.location.href = url;
}
let playerList = [];
let teams = [];
let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;
    let url = window.location.href;
    url = url.replace("viewOldScorecard", "viewPlayerStats");
    window.location.href = url;
}
playerList = JSON.parse(localStorage.playerList)

for (let i = playerList.length - 1; i >= 0; i--) {
    let player = createPlayer(randInt(60, 100), i);
    player.remakePlayer(playerList[i]);
    playerList[i] = player;
}
teams = JSON.parse(localStorage.teams);

for (let i = teams.length - 1; i >= 0; i--) {
    let team = new Team(1, 1, 1, 1, 1);
    team.remakeTeam(teams[i], playerList);
    teams[i] = team;
}
schedule = new Schedule(teams);
let scheduleOld = JSON.parse(localStorage.schedule);

schedule.remakeSchedule(scheduleOld);

let getPlayer = (id) => {
    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].playerID == id) {
            return playerList[i]
        }
    }
}
let currentScorecard = schedule.scorecards[sessionStorage.scorecardToView];
console.log(currentScorecard)
setHTML("team1Score", currentScorecard.gameResult.inning1RunsScored + "/" + currentScorecard.gameResult.inning1Wickets);
setHTML("team1Name", teams[currentScorecard.gameResult.inning1BattingTeam].teamName);
setHTML("team2Score", currentScorecard.gameResult.inning2RunsScored + "/" + currentScorecard.gameResult.inning2Wickets);
setHTML("team2Name", teams[currentScorecard.gameResult.inning2BattingTeam].teamName);
setHTML("batting1ScorecardTitle", teams[currentScorecard.gameResult.inning1BattingTeam].teamName + " Batting");
setHTML("bowling1ScorecardTitle", teams[currentScorecard.gameResult.inning2BattingTeam].teamName + " Bowling");
setHTML("batting2ScorecardTitle", teams[currentScorecard.gameResult.inning2BattingTeam].teamName + " Batting");
setHTML("bowling2ScorecardTitle", teams[currentScorecard.gameResult.inning1BattingTeam].teamName + " Bowling");
let homeBattingLineup = currentScorecard.gameResult.homeBattingLineup;
let awayBattingLineup = currentScorecard.gameResult.awayBattingLineup;
let inning1BattingLineup = awayBattingLineup;
let inning2BattingLineup = homeBattingLineup;
for (let i = 0; i < playerList.length; i++) {
    if (playerList[i].playerID == homeBattingLineup[0]) {
        if (currentScorecard.gameResult.inning1BattingTeam == playerList[i].teamID) {
            inning1BattingLineup = homeBattingLineup;
            inning2BattingLineup = awayBattingLineup;
        }
    }
}
let battingScorecard1 = "<table class='battingScorecard'>"
battingScorecard1 += "<tr><th>Name</th><th>R</th><th>B</th><th>SR</th><th>W</th><th>4s</th><th>6s</th></tr>";
for (i = 0; i < inning1BattingLineup.length; i++) {
    let batter = currentScorecard["player" + inning1BattingLineup[i]];
    battingScorecard1 += "<tr>";
    battingScorecard1 += tableCell("<button onclick=viewPlayerStats(" + batter.playerID + ")>" + getPlayer(batter.playerID).name + "</button>");
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
for (i = 0; i < inning2BattingLineup.length; i++) {
    let batter = currentScorecard["player" + inning2BattingLineup[i]];
    battingScorecard2 += "<tr>";
    battingScorecard2 += tableCell("<button onclick=viewPlayerStats(" + batter.playerID + ")>" + getPlayer(batter.playerID).name + "</button>");
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
for (i = 0; i < inning2BattingLineup.length; i++) {
    let bowler = currentScorecard["player" + inning2BattingLineup[i]];
    if (bowler.ballsBowled > 0) {

        bowlingScorecard1 += "<tr>";
        bowlingScorecard1 += tableCell("<button onclick=viewPlayerStats(" + inning2BattingLineup[i] + ")>" + getPlayer(inning2BattingLineup[i]).name + "</button>");
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
for (i = 0; i < inning1BattingLineup.length; i++) {
    let bowler = currentScorecard["player" + inning1BattingLineup[i]];
    if (bowler.ballsBowled > 0) {

        bowlingScorecard2 += "<tr>";
        bowlingScorecard2 += tableCell("<button onclick=viewPlayerStats(" + inning1BattingLineup[i] + ")>" + getPlayer(inning1BattingLineup[i]).name + "</button>");
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
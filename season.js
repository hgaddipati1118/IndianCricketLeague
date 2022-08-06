let playerList = [];
let teams = [];
sessionStorage.rosters = "zilch";
let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("season", "viewplayerstats");
    window.location.href = url;
}
let viewTeamStats = (id) => {
    sessionStorage.currentTeamView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("season", "viewteam");
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
    if (team.teamID != localStorage.userTeam) {
        team.autoSortLineups();
    }
}
schedule = new Schedule(teams, true);
let scheduleOld = JSON.parse(localStorage.schedule);

schedule.remakeSchedule(scheduleOld);
document.getElementById("schedule").innerHTML = schedule.htmlOutput();
schedule.makeStandings();
console.log("HERE")

let nextMatchClick = (i) => {
    sessionStorage.gameNumber = i;
    sessionStorage.homeTeam = schedule.schedule[i].homeTeam;
    sessionStorage.awayTeam = schedule.schedule[i].awayTeam;
    console.log(sessionStorage.homeTeam)
    if (sessionStorage.homeTeam == localStorage.userTeam || sessionStorage.awayTeam == localStorage.userTeam) {
        console.log("HI")
        console.log(teams[localStorage.userTeam].battingLineup)
        for (let i = 0; i < teams[localStorage.userTeam].battingLineup.length; i++) {
            console.log(teams[1].findPlayer(teams[localStorage.userTeam].battingLineup[i]).name)
            if (teams[1].findPlayer(teams[localStorage.userTeam].battingLineup[i]).injury > 0) {
                alert("Your team has injured players in your lineup, please fix")
                sessionStorage.autoPlay = 0;
                let url = window.location.href.toLowerCase();
                url = url.replace("season", "teamroster");
                window.location.href = url;
                return;
            }
        }
    }
    let url = window.location.href.toLowerCase();
    url = url.replace("season", "game");
    window.location.href = url;
}
let auto = (i) => {
        sessionStorage.autoPlayGameNumber = i;
        sessionStorage.autoPlay = 1;
        if (sessionStorage.autoPlay > 0) {
            if (schedule.gameNumber < sessionStorage.autoPlayGameNumber) {
                nextMatchClick(schedule.gameNumber);
            } else {
                sessionStorage.autoPlay = 0;
            }
        }
    }
    //NEEED TO FIX 5/13
let playerWithStatsList = [];
for (let i = 0; i < playerList.length; i++) {
    currentPlayer = playerList[i];
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
    let dotsBowled = 0;
    let gameStats = currentPlayer.stats;
    for (let h = 0; h < gameStats.length; h++) {
        wickets += gameStats[h].wickets;
        runsScored += gameStats[h].runs;
        runsConceded += gameStats[h].runsConceded;
        ballsBowled += gameStats[h].ballsBowled;
        ballsFaced += gameStats[h].ballsFaced;
        dotsBowled += gameStats[h].dotBallsBowled;
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
    currentPlayer.dotsBowled = dotsBowled
    if (isNaN(currentPlayer.ballsBowled)) {
        currentPlayer.ballsBowled = 0;
    }
        if (isNaN(currentPlayer.dotsBowled)) {
        currentPlayer.dotsBowled = 0;
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
    currentPlayer.mvpPoints = currentPlayer.foursScored *2.5 + currentPlayer.sixesScored *3.5 + currentPlayer.wickets *3.5 + currentPlayer.dotsBowled;
    playerWithStatsList.push(currentPlayer);
}
console.log(playerWithStatsList)
let mvpRace = playerWithStatsList.map(element => element);
mvpRace.sort((a, b) => (a.mvpPoints > b.mvpPoints) ? -1 : 1)
let mvpLeaderTable = "<table>";
mvpLeaderTable += "<tr class='battingLeadersTableHeader'><th></th><th>Name</th><th>Mat</th><th>Runs</th><th>4s</th><th>6s</th><th>Ovrs</th><th>Runs</th><th>Wkts</th><th>D</th><th>Pts</th></tr>";
for (let i = 0; i < 25; i++) {
    mvpLeaderTable += "<tr><td>#" + (i + 1) + "</td>";
    mvpLeaderTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewPlayerStats(" + mvpRace[i].playerID + ")>" + mvpRace[i].name +  "</button>" + "</td>";
    mvpLeaderTable += "<td>" + mvpRace[i].gamesPlayed + "</td>";
    mvpLeaderTable += "<td>" + mvpRace[i].runsScored + "</td>";
    mvpLeaderTable += "<td>" + mvpRace[i].foursScored + "</td>";
    mvpLeaderTable += "<td>" + mvpRace[i].sixesScored + "</td>";
    mvpLeaderTable += "<td>" + Math.floor(mvpRace[i].ballsBowled / 6) + "." + (mvpRace[i].ballsBowled % 6) + "</td>";
    mvpLeaderTable += "<td>" + mvpRace[i].runsConceded + "</td>";
    mvpLeaderTable += "<td>" + mvpRace[i].wickets + "</td>";
    mvpLeaderTable += "<td>" + mvpRace[i].dotsBowled + "</td>";
        mvpLeaderTable += "<td>" + mvpRace[i].mvpPoints + "</td>";
   mvpLeaderTable += "</tr>";
}
mvpLeaderTable += "</table>";
document.getElementById("mvpRace").innerHTML = mvpLeaderTable;
let runsLeaders = playerWithStatsList.map(element => element);
runsLeaders.sort((a, b) => (a.runsScored > b.runsScored) ? -1 : 1)
let runsLeaderTable = "<table>";
runsLeaderTable += "<tr class='battingLeadersTableHeader'><th></th><th>Name</th><th>Mat</th><th>Inns</th><th>Runs</th><th>Avg</th><th>NO</th><th>BF</th><th>SR</th><th>4s</th><th>6s</th></tr>";
for (let i = 0; i < 25; i++) {
    runsLeaderTable += "<tr><td>#" + (i + 1) + "</td>";
    runsLeaderTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewPlayerStats(" + runsLeaders[i].playerID + ")>" + runsLeaders[i].name + "</button>" + "</td>";
    runsLeaderTable += "<td>" + runsLeaders[i].gamesPlayed + "</td>";
    runsLeaderTable += "<td>" + runsLeaders[i].inningsBatted + "</td>";
    runsLeaderTable += "<td>" + runsLeaders[i].runsScored + "</td>";
    runsLeaderTable += "<td>" + Math.floor(100 * runsLeaders[i].battingAverage) / 100 + "</td>";
    runsLeaderTable += "<td>" + runsLeaders[i].notOuts + "</td>";
    runsLeaderTable += "<td>" + runsLeaders[i].ballsFaced + "</td>";
    runsLeaderTable += "<td>" + Math.floor(100 * runsLeaders[i].strikeRate) / 100 + "</td>";
    runsLeaderTable += "<td>" + runsLeaders[i].foursScored + "</td>";
    runsLeaderTable += "<td>" + runsLeaders[i].sixesScored + "</td>";
    runsLeaderTable += "</tr>";
}
runsLeaderTable += "</table>";
document.getElementById("runsLeader").innerHTML = runsLeaderTable;

let wicketsLeaders = playerWithStatsList.map(element => element);
wicketsLeaders.sort((a, b) => (a.wickets > b.wickets) ? -1 : (a.wickets === b.wickets) ? ((a.bowlingEconomy > b.bowlingEconomy) ? 1 : -1) : 1)
let wicketsLeaderTable = "<table>";
wicketsLeaderTable += "<tr class='bowlingLeadersTableHeader'><th></th><th>Name</th><th>Mat</th><th>Inns</th><th>Ovrs</th><th>Runs</th><th>Wkts</th><th>D</th><th>Avg</th><th>Econ</th></tr>";
for (let i = 0; i < 25; i++) {
    wicketsLeaderTable += "<tr><td>#" + (i + 1) + "</td>";
    wicketsLeaderTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewPlayerStats(" + wicketsLeaders[i].playerID + ")>" + wicketsLeaders[i].name + "</button>" + "</td>";
    wicketsLeaderTable += "<td>" + wicketsLeaders[i].gamesPlayed + "</td>";
    wicketsLeaderTable += "<td>" + wicketsLeaders[i].inningsBowled + "</td>";
    wicketsLeaderTable += "<td>" + Math.floor(wicketsLeaders[i].ballsBowled / 6) + "." + (wicketsLeaders[i].ballsBowled % 6) + "</td>";
    wicketsLeaderTable += "<td>" + wicketsLeaders[i].runsConceded + "</td>";
    wicketsLeaderTable += "<td>" + wicketsLeaders[i].wickets + "</td>";
    wicketsLeaderTable += "<td>" + wicketsLeaders[i].dotsBowled + "</td>";
    wicketsLeaderTable += "<td>" + Math.floor(wicketsLeaders[i].bowlingAverage * 100) / 100 + "</td>";
    wicketsLeaderTable += "<td>" + Math.floor(100 * wicketsLeaders[i].bowlingEconomy) / 100 + "</td>";
    wicketsLeaderTable += "</tr>";
}
wicketsLeaderTable += "</table>";
document.getElementById("wicketsLeader").innerHTML = wicketsLeaderTable;
let sixesLeaders = playerWithStatsList.map(element => element);
sixesLeaders.sort((a, b) => (a.sixesScored > b.sixesScored) ? -1 : (a.sixesScored === b.sixesScored) ? ((a.foursScored > b.foursScored) ? -1 : 1) : 1)

let sixesLeaderTable = "<table>";
sixesLeaderTable += "<tr class='battingLeadersTableHeader'><th></th><th>Name</th><th>Mat</th><th>Inns</th><th>Runs</th><th>Avg</th><th>NO</th><th>BF</th><th>SR</th><th>4s</th><th>6s</th></tr>";
for (let i = 0; i < 25; i++) {
    sixesLeaderTable += "<tr><td>#" + (i + 1) + "</td>";
    sixesLeaderTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewPlayerStats(" + sixesLeaders[i].playerID + ")>" + sixesLeaders[i].name + "</button>" + "</td>";
    sixesLeaderTable += "<td>" + sixesLeaders[i].gamesPlayed + "</td>";
    sixesLeaderTable += "<td>" + sixesLeaders[i].inningsBatted + "</td>";
    sixesLeaderTable += "<td>" + sixesLeaders[i].runsScored + "</td>";
    sixesLeaderTable += "<td>" + Math.floor(100 * sixesLeaders[i].battingAverage) / 100 + "</td>";
    sixesLeaderTable += "<td>" + sixesLeaders[i].notOuts + "</td>";
    sixesLeaderTable += "<td>" + sixesLeaders[i].ballsFaced + "</td>";
    sixesLeaderTable += "<td>" + Math.floor(100 * sixesLeaders[i].strikeRate) / 100 + "</td>";
    sixesLeaderTable += "<td>" + sixesLeaders[i].foursScored + "</td>";
    sixesLeaderTable += "<td>" + sixesLeaders[i].sixesScored + "</td>";
    sixesLeaderTable += "</tr>";
}
sixesLeaderTable += "</table>";
document.getElementById("sixesLeader").innerHTML = sixesLeaderTable;
let economyLeaders = playerWithStatsList.map(element => element);
economyLeaders = economyLeaders.filter(element => ((element.ballsBowled / element.inningsBowled) > 6) && (element.ballsBowled > 1)).sort((a, b) => (a.bowlingEconomy > b.bowlingEconomy) ? 1 : (a.bowlingEconomy === b.bowlingEconomy) ? ((a.wickets > b.wickets) ? -1 : 1) : -1)

if (economyLeaders.length < 25) {
    economyLeaders = playerList.map(element => element).sort((a, b) => (a.bowlingEconomy > b.bowlingEconomy) ? 1 : (a.bowlingEconomy === b.bowlingEconomy) ? ((a.wickets > b.wickets) ? -1 : 1) : -1);
}

let economyLeaderTable = "<table>";
economyLeaderTable += "<tr class='bowlingLeadersTableHeader'><th></th><th>Name</th><th>Mat</th><th>Inns</th><th>Ovrs</th><th>Runs</th><th>Wkts</th><th>D</th><th>Avg</th><th>Econ</th></tr>";
for (let i = 0; i < 25; i++) {
    economyLeaderTable += "<tr><td>#" + (i + 1) + "</td>";
    economyLeaderTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewPlayerStats(" + economyLeaders[i].playerID + ")>" + economyLeaders[i].name + "</button>" + "</td>";
    economyLeaderTable += "<td>" + economyLeaders[i].gamesPlayed + "</td>";
    economyLeaderTable += "<td>" + economyLeaders[i].inningsBowled + "</td>";
    economyLeaderTable += "<td>" + Math.floor(economyLeaders[i].ballsBowled / 6) + "." + (economyLeaders[i].ballsBowled % 6) + "</td>";
    economyLeaderTable += "<td>" + economyLeaders[i].runsConceded + "</td>";
    economyLeaderTable += "<td>" + economyLeaders[i].wickets + "</td>";
     economyLeaderTable += "<td>" + economyLeaders[i].dotsBowled + "</td>";
    economyLeaderTable += "<td>" + Math.floor(economyLeaders[i].bowlingAverage * 100) / 100 + "</td>";
    economyLeaderTable += "<td>" + Math.floor(100 * economyLeaders[i].bowlingEconomy) / 100 + "</td>";
    economyLeaderTable += "</tr>";
}
economyLeaderTable += "</table>";
document.getElementById("economyLeader").innerHTML = economyLeaderTable;
if (sessionStorage.autoPlay > 0) {
    if (schedule.gameNumber < sessionStorage.autoPlayGameNumber) {
        nextMatchClick(schedule.gameNumber);
    } else {
        sessionStorage.autoPlay = 0;
    }
}
let resignNumber = 0;
if(localStorage.schedType == "ipl70"){
    resignNumber = 73;
}
else if(localStorage.schedType == "roundRobin"){
    resignNumber = -1+teams.length*(teams.length-1);
}
console.log(resignNumber)
if (schedule.gameNumber > resignNumber) {
      document.getElementById("goToRetainings").innerHTML = "<button onclick ='goToResignings()'id='resignings'> Go To Resignings </button>";
}
localStorage.schedule = JSON.stringify(schedule);
localStorage.teams = JSON.stringify(teams);
let scorecardClick = (i) => {
    sessionStorage.scorecardToView = i;
    let url = window.location.href;
    url = url.replace("season", "viewoldscorecard");
    window.location.href = url;
}
let goToResignings = () =>{
    let url = window.location.href;
    url = url.replace("season", "retainings");
    window.location.href = url;
}
let findPlayer = (playerID) => {
    players = [];
    for (i = 0; i < playerList.length; i++) {
        if (playerList[i].playerID == playerID) {
            players.push(playerList[i]);
        }
    }
    return players;
}
console.log(findPlayer(742))
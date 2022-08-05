//Code to export save to league file

let teamViewingNumber = localStorage.userTeam;
let playerList = JSON.parse(localStorage.playerList)

for (let i = playerList.length - 1; i >= 0; i--) {
    let player = createPlayer(randInt(60, 100), i);
    player.remakePlayer(playerList[i]);
    playerList[i] = player;
}
let findPlayer = (playerID) => {
    for (i = 0; i < playerList.length; i++) {
        if (playerList[i].playerID == playerID) {
            return playerList[i];
        }
    }
}
let teams = JSON.parse(localStorage.teams);
let cpuTeams = [];
for (let i = teams.length - 1; i >= 0; i--) {
    let team = new Team(1, 1, 1, 1, 1);
    team.remakeTeam(teams[i], playerList);
    teams[i] = team;
    if (team.teamID != localStorage.userTeam) {
        cpuTeams.push(team.teamID);
        team.autoSortLineups();
    }
}
let updateTeams = () => {
    localStorage.teamRosters = JSON.stringify(teams);
}

let teamViewing = teams[teamViewingNumber];
console.log(teamViewing)
teamViewing.moneySpent = 0;

document.getElementById("teamName").innerHTML = teamViewing.teamName + " Retainings";

let retainedPlayers = 0;
let retainedPlayerNumbers = [];
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
let tables = () => {
    let playerInfoTable = "<table><tr><th colspan='5'>Player Info </th><th colspan='3'>Batting Stats</th><th colspan='4'>Bowling Stats</th><th colspan='2'>Resigning</th></tr><tr><th>Name</th><th>Age</th><th>Ovr</th><th>BT</th> <th>BWL</th><th>Runs</th><th>BF</th> <th>SR</th><th>Ovrs</th><th>Runs</th> <th>Wkts</th><th>Econ</th><th>Salary (Cr)</th><th></th></tr>";
    for (let i = 0; i < teamViewing.playerList.length; i++) {
        let currentPlayer = findPlayer(teamViewing.playerList[i]);
        let asterik = "";
        if (currentPlayer.international) {
            asterik = "*";
        }
        if (i == 10 || i == 20) {
            playerInfoTable += "<tr><th>Name</th><th>Age</th><th>Ovr</th><th>BT</th> <th>BWL</th><th>Runs</th><th>BF</th> <th>SR</th><th>Ovrs</th><th>Runs</th> <th>Wkts</th><th>Econ</th><th>Salary (Cr)</th><th></th></tr>";
        }
        playerInfoTable += "<tr>";
        playerInfoTable += tableCell("<button class ='viewPlayerStats' onclick=viewPlayerStats(" + currentPlayer.playerID + ")>" + currentPlayer.name + asterik + "</button>");
        playerInfoTable += tableCell(currentPlayer.age);
        playerInfoTable += tableCell(Math.round(currentPlayer.overall));
        playerInfoTable += tableCell(Math.round(currentPlayer.battingOverall));
        playerInfoTable += tableCell(Math.round(currentPlayer.bowlingOverall));
        playerInfoTable += tableCell(Math.round(currentPlayer.runsScored));
        playerInfoTable += tableCell(Math.round(currentPlayer.ballsFaced));
        playerInfoTable += tableCell(Math.round(currentPlayer.strikeRate));
        let overs = Math.floor(currentPlayer.ballsBowled / 6) + "." + (currentPlayer.ballsBowled % 6);
        if (isNaN(overs)) {
            overs = "0.0";
        }
        let economy = Math.round(600 * currentPlayer.runsConceded / currentPlayer.ballsBowled) / 100;
        if (isNaN(economy)) {
            economy = 0
        }
        playerInfoTable += tableCell(overs);
        playerInfoTable += tableCell(Math.round(currentPlayer.runsConceded));
        playerInfoTable += tableCell(Math.round(currentPlayer.wickets));
        playerInfoTable += tableCell(economy);
        let typeOfSigning = "Retain";
        let button = "<div id='resignPlayer" + currentPlayer.playerID + "'><button class='resignButton' onclick='resignPlayer(" + currentPlayer.playerID + ")'>" + typeOfSigning + "</button></div>";
        playerInfoTable += tableCell(Math.round(100 * currentPlayer.bid) / 100);
        if(currentPlayer.refused == true){
            playerInfoTable += tableCell ("<div class = 'refused'> Refused </div>")
        }
        else{
        playerInfoTable += tableCell(button);}
        playerInfoTable += "</tr>";
    }
    playerInfoTable += "</table>";
    document.getElementById("playerInfo").innerHTML = playerInfoTable;

    /*
    let players = "<table><tr><th>Name</th><th>Ovr</th><th>BT</th> <th>BWL</th><th>M</th><th>Inns</th><th>Runs</th><th>BF</th><th>SR</th><th>Avr</th><th>Inns</th><th>Ovrs</th><th>Runs</th><th>Wkts</th><th>Econ.</th> <th>Avg</th></tr>";
    for (let i = 0; i < teamViewing.players.length; i++) {
        let currentPlayer = teamViewing.players[i];
        let average = Math.round(currentPlayer.runsScored / (currentPlayer.inningsBatted - currentPlayer.notOuts));
        if (isNaN(average)) {
            average = currentPlayer.runsScored
        }
        let overs = Math.floor(currentPlayer.ballsBowled / 6) + "." + (currentPlayer.ballsBowled % 6);
        if (isNaN(overs)) {
            overs = "0.0";
        }
        let economy = Math.round(600 * currentPlayer.runsConceded / currentPlayer.ballsBowled) / 100;
        if (isNaN(economy)) {
            economy = 0
        }
        let bowlingAverage = Math.round(100 * currentPlayer.runsConceded / currentPlayer.wickets) / 100;
        if (isNaN(bowlingAverage)) {
            bowlingAverage = currentPlayer.runsConceded;
        }
        console.log(currentPlayer);
        players += "<tr>";
        players += tableCell(currentPlayer.name);
        players += tableCell(Math.round(currentPlayer.overall));
        players += tableCell(Math.round(currentPlayer.battingOverall));
        players += tableCell(Math.round(currentPlayer.bowlingOverall));
        players += tableCell(Math.round(currentPlayer.gamesPlayed));
        players += tableCell(Math.round(currentPlayer.inningsBatted));
        players += tableCell(Math.round(currentPlayer.runsScored));
        players += tableCell(Math.round(currentPlayer.ballsFaced));
        players += tableCell(Math.round(currentPlayer.strikeRate));
        players += tableCell(Math.round(average));
        players += tableCell(Math.round(currentPlayer.inningsBowled));
        players += tableCell(overs);
        players += tableCell(Math.round(currentPlayer.runsConceded));
        players += tableCell(Math.round(currentPlayer.wickets));
        players += tableCell(economy);
        players += tableCell(bowlingAverage);



        players += "</tr>";

    }
    players += "</table>";
    document.getElementById("players").innerHTML = players;*/
}
tables();
let resignSimmed = false;
let simResignings = () => {
    if (resignSimmed) {
        return;
    }
    for (let i = 0; i < teamViewing.playerList.length; i++) {
        let currentPlayer = findPlayer(teamViewing.playerList[i]);
        currentPlayer.calcValue();

        let randomNuw = Math.random();
        if(randomNuw>(currentPlayer.bid/(2*currentPlayer.value))){

            playerRefuse(currentPlayer.playerID)
        }
        else if (Math.random() < Math.pow((currentPlayer.bid / (1.5 * currentPlayer.value)), 2)) {
            resignPlayer(currentPlayer.playerID);
        }
        

    }
    resignSimmed = true;
}
let playerRefuse = (playerId) => {
    
    for (let i = 0; i < teamViewing.playerList.length; i++) {
        if (teamViewing.playerList[i] == playerId) {
            let currentPlayer = findPlayer(teamViewing.playerList[i]);
            document.getElementById("resignPlayer" + playerId).innerHTML = "<div class='refused'> Refused </div>";
            currentPlayer.retained = false;
            currentPlayer.refused = true;
        }
    }
    localStorage.playerList = JSON.stringify(playerList);
    }


let resignPlayer = (playerId) => {
    
    for (let i = 0; i < teamViewing.playerList.length; i++) {
        if (teamViewing.playerList[i] == playerId) {
            let currentPlayer = findPlayer(teamViewing.playerList[i]);
            if(Math.random()>(currentPlayer.bid/(2*currentPlayer.value))){
                playerRefuse(currentPlayer.playerID)
            }
            else{
            if((teamViewing.moneySpent + currentPlayer.bid)<90){
                document.getElementById("resignPlayer" + playerId).innerHTML = "<div class='resigned'> Resigned </div>";
            currentPlayer.retained = true;
            teamViewing.moneySpent += currentPlayer.bid;
            document.getElementById("moneyLeft").innerHTML = "Money Left: " + (Math.round((90 - teamViewing.moneySpent) * 100) / 100) + " Crores"
        }}
    }
    }

}
let clearResignings = () => {
    for (let i = 0; i < teamViewing.playerList.length; i++) {
        findPlayer(teamViewing.playerList[i]).retained = false;

    }
    resignSimmed = false;
    teamViewing.moneySpent = 0;
    document.getElementById("moneyLeft").innerHTML = "Money Left: " + (Math.round((90 - teamViewing.moneySpent) * 100) / 100) + " Crores";
    tables();

}
let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;
    console.log(id);
    let url = window.location.href;
    url = url.replace("retainings", "viewPlayerStats");
    window.location.href = url;

}
console.log(cpuTeams);
for (let i = 0; i < cpuTeams.length; i++) {
    let currentTeam = teams[cpuTeams[i]];
    /*   for (let g = 0; g < currentTeam.players.length; g++) {
           let currentPlayer = currentTeam.players[g];
           if (Math.random() > Math.pow((currentPlayer.bid / (1.1 * currentPlayer.value)), 2)) {
               currentPlayer.retained = true;
           }
       }*/
    for (let i = 0; i < currentTeam.playerList.length; i++) {
        let currentPlayer = findPlayer(currentTeam.playerList[i]);

        if (Math.random() > Math.pow((currentPlayer.bid / (1.5 * currentPlayer.value)), 2)) {
            currentPlayer.retained = true;

        }

    }
}
let goToAuction = () => {
    for (let i = 0; i < teams.length; i++) {
        let currentTeam = teams[i];
        let newPlayers = [];
        currentTeam.moneySpent = 0;
        let newPlayerList = []
        for (let g = 0; g < currentTeam.playerList.length; g++) {
            let currentPlayer = findPlayer(currentTeam.playerList[g]);
            currentPlayer.age++;
            currentPlayer.stats = [];
            currentPlayer.refused = false;
            currentPlayer.injury = 0;
            console.log(currentPlayer.retained);
            if (!currentPlayer.retained) {
                currentPlayer.teamID = "FA";
            } else {
                newPlayerList.push(currentPlayer.playerID);
            }

        }
        currentTeam.playerList = newPlayerList;

    }
    let maxID = 0;
    for(let i=0; i<playerList.length;i++){
        if(playerList[i].playerID>maxID){
            maxID = playerList[i].playerID;
        }
    }
    let addingNumber = maxID+1;
    for (let i = 0; i < 250; i++) {
        let playerMade = createPlayerNew(addingNumber+i);
        if(playerList.every(element=> element.playerID!=playerMade.playerID))
        {playerList.push(playerMade)
        }
        else{
            addingNumber++;
            alert("DUPLICATE MADE")
        }
    }
    
    localStorage.playerList = JSON.stringify(playerList);
    localStorage.teams = JSON.stringify(teams);
    localStorage.season++;
    localStorage.auctionRecord = "NEW";
    let url = window.location.href;
    url = url.replace("retainings", "auction");
    window.location.href = url;

}
sessionStorage.playerOneChosen = "false";
let teamViewingNumber = localStorage.userTeam;
console.log(localStorage.userTeam)
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
teamViewing = teams[teamViewingNumber];
document.getElementById("teamName").innerHTML = teamViewing.teamName;
let updateTeams = () => {
    localStorage.teams = JSON.stringify(teams);
}
let findPlayer = (playerID) => {
    for (i = 0; i < playerList.length; i++) {
        if (playerList[i].playerID == playerID) {
            return playerList[i];
        }
    }
}
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
let swap = (player) => {
    if (sessionStorage.playerOneChosen != "true") {
        sessionStorage.playerOneChosen = "true";
        sessionStorage.playerOne = player;
        document.getElementById("playerRow" + player).classList.add("playerSelected");
        console.log(document.getElementById("playerRow" + player));
    } else {
        sessionStorage.playerOneChosen = "false";
        let playerOne = teamViewing.playerList[sessionStorage.playerOne];
        teamViewing.playerList[sessionStorage.playerOne] = teamViewing.playerList[player];
        teamViewing.playerList[player] = playerOne;
        if (player < 11) {
            teamViewing.battingLineup[player] = playerOne;
        }
        if (sessionStorage.playerOne < 11) {
            teamViewing.battingLineup[sessionStorage.playerOne] = teamViewing.playerList[sessionStorage.playerOne];
        }
        if (player >= 11 && sessionStorage.playerOne < 11) {
            for (let i = 0; i < teamViewing.bowlingOrder.length; i++) {
                if (teamViewing.bowlingOrder[i] == playerOne) {
                    teamViewing.bowlingOrder[i] = teamViewing.playerList[sessionStorage.playerOne];
                }
            }
        }
        if (player < 11 && sessionStorage.playerOne >= 11) {
            for (let i = 0; i < teamViewing.bowlingOrder.length; i++) {
                if (teamViewing.bowlingOrder[i] == teamViewing.playerList[sessionStorage.playerOne]) {
                    teamViewing.bowlingOrder[i] = playerOne;
                }
            }
        }
        if(teamViewing.countInternationalInLineup()>4){
            alert("Already 4 internationals in lineup!")
            document.getElementById("playerRow" + sessionStorage.playerOne).classList.remove("playerSelected");
            
        }
        else{
        bowlingOrderTable();
        battingTable();}
    }




}
let up = (player) => {
    if (player != 0) {
        let tempVar = teamViewing.playerList[player];
        teamViewing.playerList[player] = teamViewing.playerList[player - 1];
        teamViewing.playerList[player - 1] = tempVar;
        if (player == 11) {
            teamViewing.battingLineup[10] = teamViewing.playerList[player - 1];
            for (let i = 0; i < teamViewing.bowlingOrder.length; i++) {
                if (teamViewing.bowlingOrder[i] == teamViewing.playerList[player]) {
                    teamViewing.bowlingOrder[i] = teamViewing.playerList[player - 1];
                }
            }

        } else if (player < 11) {
            teamViewing.battingLineup[player] = teamViewing.playerList[player];
            teamViewing.battingLineup[player - 1] = teamViewing.playerList[player - 1];
        }
    }
    bowlingOrderTable();
    battingTable();
}
let down = (player) => {
    if (player != teamViewing.playerList.length - 1) {
        let tempVar = teamViewing.playerList[player];
        teamViewing.playerList[player] = teamViewing.playerList[player + 1];
        teamViewing.playerList[player + 1] = tempVar;
        if (player == 10) {
            teamViewing.battingLineup[10] = teamViewing.playerList[player];
            for (let i = 0; i < teamViewing.bowlingOrder.length; i++) {
                if (teamViewing.bowlingOrder[i] == teamViewing.playerList[player + 1]) {
                    teamViewing.bowlingOrder[i] = teamViewing.playerList[player];
                }
            }

        } else if (player < 10) {
            teamViewing.battingLineup[player] = teamViewing.playerList[player];
            teamViewing.battingLineup[player + 1] = teamViewing.playerList[player + 1];
        }
    }
    bowlingOrderTable();
    battingTable();
}
let bowlingOrderTable = () => {

    let bowlingOrderTable = "<table><tr><th> Over</th> <th>Bowler</th><th> Over</th> <th>Bowler</th><th> Over</th> <th>Bowler</th><th> Over</th> <th>Bowler</th></tr>";
    for (let h = 1; h < 6; h++) {
        bowlingOrderTable += "<tr>";
        for (let g = 0; g < 4; g++) {
            let i = (5 * g) + h;
            let options = `<select name ="over${(i - 1)}" onChange="updateBowling(${i-1})" id='bowlerOver${i - 1}'>`;
            for (let k = 0; k < teamViewing.battingLineup.length; k++) {
                let selected = "";
                let name = findPlayer(teamViewing.battingLineup[k]).name;
                let number = teamViewing.battingLineup[k];
                if (teamViewing.bowlingOrder[i - 1] == teamViewing.battingLineup[k]) {
                    selected = " selected";
                    options += "<option value ='" + number + "'" + selected + " > " + name + " </option>";

                } else {
                    options += "<option value ='" + number + "'" + " > " + name + " </option>";

                }
            }
            options += "</select>";


            bowlingOrderTable += tableCell(i);
            bowlingOrderTable += tableCell(options);



            /*let name = findPlayer(teamViewing.bowlingOrder[i - 1]).name;
            let options = "<div name ='" + (i - 1) + "' id='bowlerOver" + (i - 1) +
                "'>" + name + "</div>";


            bowlingOrderTable += tableCell(i);
            bowlingOrderTable += tableCell(options);*/

        }
        bowlingOrderTable += "</tr>";
    }
    bowlingOrderTable += "</table>";
    document.getElementById("bowlingLineup").innerHTML = bowlingOrderTable;
    updateTeams();
}
let battingTable = () => {
    sessionStorage.playerOneChosen = "false";
    let playerInfoTable = "<table><tr><td colspan='7' class='tableMergedHeaders'>Player Info</td><td colspan='6' class='tableMergedHeaders'>Batting Stats</td><td colspan='6' class='tableMergedHeaders'>Bowling Stats</td></tr><tr><th colspan='2'></th><th>#</th><th>Name</th><th>Ovr</th><th>BT</th> <th>BWL</th><th>M</th><th>Inns</th><th>Runs</th><th>BF</th> <th>SR</th><th>Avr</th><th>Inns</th><th>Ovrs</th><th>Runs</th> <th>Wkts</th><th>Econ</th><th>Avr</th></tr>";
    for (let i = 0; i < teamViewing.playerList.length; i++) {
        let currentPlayer = findPlayer(teamViewing.playerList[i]);
        let asterik = "";
        if (currentPlayer.international) {
            asterik = "*";
        }
        let color = "inherit";
        if (currentPlayer.injury > 0) {
            color = "red";
            console.log(color);
        }
        let injury = "";
        if (currentPlayer.injury > 0) {
            injury = " (" + currentPlayer.injury + ")";
        }
        playerInfoTable += `<tr id="playerRow${i}">`;
        playerInfoTable += `<td class='maxWidth'> <button class="swapPlayers" onclick="swap(${i})">Swap</button></td>`;
        playerInfoTable += `<td><div class="upDownArrowContainers"><div><button class="arrowButtons" onclick = up(${i})><i class="arrow up"></i></button></div><div><button class="arrowButtons" onclick = down(${i})><i class = "arrow down"></i></button></div></div></td>`
        playerInfoTable += `<td class = "maxWidth">  ${(i + 1)} </td>`
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
    document.getElementById("playerRow11").classList.add("benchSeperation");
    updateTeams();
}
let autoBowlingLineup = () => {
    teamViewing.autoSortBowling();
    bowlingOrderTable();
    battingTable();
}
let autoBattingLineup = () => {

    for (let i = 0; i < 10; i++) {
        if (findPlayer(teamViewing.battingLineup[i]).battingOverall < findPlayer(teamViewing.battingLineup[i + 1]).battingOverall) {

            down(i);
        }
    }
}
let autoLineup = () => {
    teamViewing.autoSortLineups();
    bowlingOrderTable();
    battingTable();
}
let updateBowling = (over) => {
    let oldBowlingOrder = teamViewing.bowlingOrder.map(element => element);
    teamViewing.bowlingOrder[over] = parseInt(document.getElementById("bowlerOver" + over).value);
    let countPlayer = 0;
    for (let i = 0; i < teamViewing.bowlingOrder.length; i++) {
        if (teamViewing.bowlingOrder[i] == teamViewing.bowlingOrder[over]) {
            countPlayer++;
        }
    }
    if (countPlayer > 4) {
        alert("A player can only bowl 4 overs")
        teamViewing.bowlingOrder = oldBowlingOrder;
    } else if (teamViewing.bowlingOrder[over] == teamViewing.bowlingOrder[over + 1] || teamViewing.bowlingOrder[over] == teamViewing.bowlingOrder[over - 1]) {
        alert("A player can not bowl back to back overs")
        teamViewing.bowlingOrder = oldBowlingOrder;
    }

    bowlingOrderTable();


}
bowlingOrderTable();
battingTable();

let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("teamroster", "viewplayerstats");
    window.location.href = url;
}
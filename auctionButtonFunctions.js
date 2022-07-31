let giveTeamRoster = () => {
    let teamRoster = [];
    let teamRosterToBeGiven = document.getElementById("teamRosterSelected").value;
    for (let i = teams.length - 1; i >= 0; i--) {
        if (teams[i].teamID == teamRosterToBeGiven) {
            teamRosterToBeGiven = i;
            break;
        }
    }
    let currentTeamSelected = teams[teamRosterToBeGiven];
    document.getElementById("teamRosterSelected").style.backgroundColor = currentTeamSelected.primaryColorHexcode;
    document.getElementById("teamRosterSelected").style.color = currentTeamSelected.secondaryColorHexcode;
    for (let i = 0; i < currentTeamSelected.playerList.length; i++) {
        let currentPlayer = {};
        for (let h = 0; h < playerList.length; h++) {
            if (playerList[h].playerID == currentTeamSelected.playerList[i]) {
                currentPlayer = playerList[h];
            }
        }
        let dumpString = "";
        let asterik = "";
        if (currentPlayer.international) {
            asterik = "*";
        }
        dumpString = `<b>  ${currentPlayer.name}${asterik} </b> (${Math.round(currentPlayer.bid*100)/100} Crores, Ovr:  ${Math.round(currentPlayer.overall)} , Age:  ${currentPlayer.age}) <br>`;
        teamRoster.push(dumpString);

    }
    document.getElementById("teamRoster").innerHTML = teamRoster.join("");
    currentTeamSelected.calcSalary();
    let teamMoneySpent = `Money Spent: ${round(currentTeamSelected.teamSalary,2)} crores`;
    document.getElementById("teamMoneySpent").innerHTML = teamMoneySpent;
}

let playerListToggle = (a) => {
    if (a == 0) {
        document.getElementById("playersSold").style.maxHeight = "0vh";
        document.getElementById("playersSold").style.visibility = "hidden";
        document.getElementById("playersSoldButton").style.backgroundColor = "white";
        document.getElementById("playersSoldButton").style.color = "black";
        document.getElementById("upNextPlayersList").style.maxHeight = "400px";
        document.getElementById("upNextPlayersList").style.visibility = "visible";
        document.getElementById("playersUpNextButton").style.backgroundColor = "black";
        document.getElementById("playersUpNextButton").style.color = "white";
    } else {
        document.getElementById("playersSold").style.maxHeight = "400px";
        document.getElementById("playersSold").style.visibility = "visible";
        document.getElementById("playersSoldButton").style.backgroundColor = "Black";
        document.getElementById("playersSoldButton").style.color = "white";
        document.getElementById("upNextPlayersList").style.maxHeight = "0vh";
        document.getElementById("upNextPlayersList").style.visibility = "hidden";
        document.getElementById("playersUpNextButton").style.backgroundColor = "white";
        document.getElementById("playersUpNextButton").style.color = "black";
    }
}
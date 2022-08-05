let playerList = [];
sessionStorage.internationalAlert = "false";
if (localStorage.playerList == undefined) {
    console.log(sessionStorage.rosters)
    if(sessionStorage.rosters == "2021"){
    for(let i =0; i<cricketPlayerListWithTeams.length;i++){
        playerList.push(importPlayerWithTeam(cricketPlayerListWithTeams[i],i));
    }
    for (let i = 0; i < 0.5 * cricketPlayerListWithTeams.length; i++) {
        playerList.push(createPlayer(60, i +  cricketPlayerListWithTeams.length, false));
    }}
    else if (sessionStorage.rosters == "2022"){
        console.log("HI")
        for(let i =0; i<cricketPlayerList2022WithTeams.length;i++){
            playerList.push(importPlayerWithTeam(cricketPlayerList2022WithTeams[i],i));
        }
        
    }
    else{
   for (let i = 0; i < 1000; i++) {
       let temp = importPlayer( cricketPlayerList2022[i], i);
       let internationalCount = 0;
       if(temp.international == "true"){
           internationalCount += 1;
           if(internationalCount<300){
            playerList.push(temp);
           }
       }
       else{
           playerList.push(temp);
       }
        


    }
    
}
      /*  for (let i = 0; i < 500; i++) {
            playerList.push(createPlayer(100, i , true));
        }
        for(let i=0; i<250; i++){
            playerList.push(createPlayer(75, i+1000))
        }*/
        
    }else {
    playerList = JSON.parse(localStorage.playerList)
    for (let i = playerList.length - 1; i >= 0; i--) {
        let player = createPlayer(randInt(60, 100), i);
        player.remakePlayer(playerList[i]);
        playerList[i] = player;
    }

}
teams = JSON.parse(localStorage.teams);
    for (let i = teams.length - 1; i >= 0; i--) {
        let team = new Team(1, 1, 1, 1, 1);
        team.remakeTeam(teams[i], playerList);
        teams[i] = team;
    }
let teamRosterSelection = `<select name="teamRosterSelected" id="teamRosterSelected" onchange="giveTeamRoster()">`;
for (let i = 0; i < teams.length; i++) {

    teamRosterSelection += `<option class="teamSelectionOption"  id = ${"teamRoster" + teams[i].teamID} value = ${teams[i].teamID} style="background-color:${teams[i].primaryColorHexcode}; color:${teams[i].secondaryColorHexcode}"> ${teams[i].teamName}</option>`
}
teamRosterSelection += "</select>";
document.getElementById("teamRosterTitle").innerHTML = teamRosterSelection;
document.getElementById("teamRoster" + localStorage.userTeam).selected = true;
let htmlElementIDs = {
    "teamsLeft": "teamsLeft",
    "currentBid": "bidPrice",
    "soldPlayers": "playersSold",
    "playersUpNext": "upNextPlayersList",
    "playerName": "playerName",
    "playerOverall": "playerOverall",
    "playerAge": "playerAge",
    "playerBowlingOverall": "playerBowlingOverall",
    "playerBattingOverall": "playerBattingOverall",
    "playerEconomy": "playerEconomy",
    "playerWicketTaking": "playerWicketTaking",
    "playerClutch": "playerClutch",
    "playerAccuracy": "playerAccuracy",
    "playerBattingIQ": "playerBattingIQ",
    "playerTiming": "playerTiming",
    "playerPower": "playerPower",
    "playerRunning": "playerRunning"


}
console.log(playerList)
console.log(teams)
if(sessionStorage.rosters == "2021" || sessionStorage.rosters == "2022"){
    
    sessionStorage.rosters = "zilchAuction";}

let auction = new Auction(playerList, teams, htmlElementIDs, parseInt(localStorage.userTeam));
console.log("HI")
sessionStorage.rankingItem = "BLANK";
let viewTeamStats = (id) => {
    sessionStorage.currentTeamView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("powerRankings", "viewTeam");
    window.location.href = url;
}

let playerList = JSON.parse(localStorage.playerList)
let findPlayer=(id)=> {
      
    for (let i = 0; i < playerList.length; i++) {
        if (playerList[i].playerID == id) {
            return (playerList[i])
        }
    }
}
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
schedule = new Schedule(teams);
let scheduleOld = JSON.parse(localStorage.schedule);

schedule.remakeSchedule(scheduleOld);
let headerNames = ["Name","W","L","NRR","Ovr","Bt Ovr", "Bwl Ovr","Biq","Pwr","Run","Tmg","Econ","Acc","Clt","Wkt"]
let headers = ["teamName","wins","losses","netRunRate","overall", "battingOverall", "bowlingOverall",  "battingIQ", "power", "running", "timing", "economy", "accuracy","clutch", "wicketTaking"];
let traits = ["overall", "battingOverall", "bowlingOverall",  "battingIQ", "power", "running", "timing", "economy", "accuracy","clutch", "wicketTaking"];
let battingTraits = ["battingOverall",  "battingIQ", "power", "running", "timing"];
let bowlingTraits = [ "bowlingOverall", "economy", "accuracy","clutch", "wicketTaking"];
let determineTeamRatings = (item) =>{
console.log(item)
for(let i=teams.length-1; i>=0; i--){
    teams[i].battingOvr = 0;
    for(let h=0; h<traits.length;h++){
        teams[i][traits[h]] = 0;
    }
    for(let g=0;g<teams[i].battingLineup.length;g++){
        
        for(let h=0; h<battingTraits.length;h++){
            teams[i][battingTraits[h]] += (1-Math.pow(g/10,1.5))*findPlayer(teams[i].battingLineup[g])[battingTraits[h]];
        }
    }
    for(let g=0;g<teams[i].bowlingOrder.length;g++){
        
        for(let h=0; h<bowlingTraits.length;h++){
            teams[i][bowlingTraits[h]] += findPlayer(teams[i].bowlingOrder[g])[bowlingTraits[h]];
        }
    }
    for(let h=0; h<battingTraits.length;h++){
        teams[i][battingTraits[h]] = Math.round(teams[i][battingTraits[h]]/6.4883);
    }
    for(let h=0; h<bowlingTraits.length;h++){
        teams[i][bowlingTraits[h]] = Math.round(teams[i][bowlingTraits[h]]/20);
    }
    teams[i]["overall"] = Math.round((teams[i]["battingOverall"]+teams[i]["bowlingOverall"])/2);

}
let standings = teams;
standings.sort((a, b) => ((a[item] > b[item]) ? -1 :  1));
if(sessionStorage.rankingItem == item){standings.sort((a, b) => ((a[item] > b[item]) ? 1 :  -1));}
let standingsTable = "<div><table>";
standingsTable +="<tr class='standingsHeader'> ";
for(let i=0; i< headers.length;i++){
    standingsTable += `<th> <button class="rankingHeader" onclick = 'determineTeamRatings("${headers[i]}")'>${headerNames[i]}</button> </th>`;
}
standingsTable += "</tr>";
for (let i = 0; i < standings.length; i++) {
    standingsTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewTeamStats(" + standings[i].teamID + ")>" + standings[i].teamName + "</button>" + "</td>";
    standingsTable += "<td>" +    standings[i].wins + "</td>";
    standingsTable += "<td>" +    standings[i].losses + "</td>";
    standingsTable += "<td>" +    standings[i].netRunRate + "</td>";
    for(let h=0; h<traits.length;h++){
        standingsTable += "<td>" +    standings[i][traits[h]] + "</td>";
    }
   
    standingsTable += "</tr>"
}
this.standings = standings;
setHTML("standings", standingsTable)
if(sessionStorage.rankingItem != item){
sessionStorage.rankingItem = item;}
else{
    sessionStorage.rankingItem = "BLANK";
}
}
let switchToHealthy = () =>{
    for(let i=0; i<teams.length; i++){
        teams[i].autoSortLineupsHealthy();
    }
    setHTML("switcher",`<button onclick = "switchToCurrent()"> View Current Rankings </button> `)
    determineTeamRatings("teamName");
    determineTeamRatings("teamName");
}
let switchToCurrent = () =>{
    teams = JSON.parse(localStorage.teams);

    for (let i = teams.length - 1; i >= 0; i--) {
        let team = new Team(1, 1, 1, 1, 1);
        team.remakeTeam(teams[i], playerList);
        teams[i] = team;
        if (team.teamID != localStorage.userTeam) {
            team.autoSortLineups();
        }
    }
    setHTML("switcher",`<button onclick = "switchToHealthy()"> View Healthy Rankings </button> `)
    determineTeamRatings("teamName");
    determineTeamRatings("teamName");
}
determineTeamRatings("teamName");
determineTeamRatings("teamName");
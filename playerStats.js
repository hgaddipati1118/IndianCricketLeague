sessionStorage.rankingItem = "BLANK";
let viewTeamStats = (id) => {
    sessionStorage.currentTeamView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("playerStats", "viewTeam");
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

teams = JSON.parse(localStorage.teams);

for (let i = teams.length - 1; i >= 0; i--) {
    let team = new Team(1, 1, 1, 1, 1);
    team.remakeTeam(teams[i], playerList);
    teams[i] = team;
    if (team.teamID != localStorage.userTeam) {
        team.autoSortLineups();
    }
}
for (let i = playerList.length - 1; i >= 0; i--) {
    let player = createPlayer(randInt(60, 100), i);
    player.remakePlayer(playerList[i]);
    playerList[i] = player;
    if(isNumber(player.teamID)){
    player.teamName = teams[player.teamID].teamName;}
    else{
        player.teamName = "FA";
    }
}
schedule = new Schedule(teams);
let scheduleOld = JSON.parse(localStorage.schedule);

schedule.remakeSchedule(scheduleOld);
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
    let foursConceded = 0;
    let sixesConceded = 0;

    let gameStats = currentPlayer.stats;
    console.log(gameStats)
    for (let h = 0; h < gameStats.length; h++) {
        wickets += gameStats[h].wickets;
        runsScored += gameStats[h].runs;
        runsConceded += gameStats[h].runsConceded;
        ballsBowled += gameStats[h].ballsBowled;
        ballsFaced += gameStats[h].ballsFaced;
        dotsBowled += gameStats[h].dotBallsBowled;
        sixes += gameStats[h].sixes;
        fours += gameStats[h].fours;
        foursConceded += gameStats[h].foursConceded;
        sixesConceded += gameStats[h].sixesConceded;

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
        currentPlayer.strikeRate = "NA";
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
    currentPlayer.oversBowled = Math.floor(ballsBowled/6) + "." + ballsBowled%6;
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
        currentPlayer.bowlingEconomy = "NA";
    }
    currentPlayer.foursConceded = foursConceded;
    currentPlayer.sixesConceded = sixesConceded;
    currentPlayer.mvpPoints = currentPlayer.foursScored *2.5 + currentPlayer.sixesScored *3.5 + currentPlayer.wickets *3.5 + currentPlayer.dotsBowled;
}

let headerNames = ["Name","Team","Age","MVP","M", "Inn","Runs","BF","SR","Avg","NO","4s","6s"]
let headers = ["name","teamName","age","mvpPoints", "gamesPlayed", "inningsBatted",  "runsScored", "ballsFaced", "strikeRate", "battingAverage", "notOuts", "foursScored","sixesScored"];
let inputValues = ["","","","","" ,"" ,"" ,"" , "","" ,"" , "",""];
let viewBowlingStats = () =>{
    sessionStorage.bowling = true;
    setHTML("standingsTitle","View Player Bowling Stats");
    document.getElementById("switcher").innerHTML = `<div id="switcher"><button onclick = "viewBattingStats()"> View Batting Stats </button> </div>`
        headerNames = ["Name","Team","Age","MVP","M", "Inn","Ovr","Runs","Econ","Wkts","Avg","D","4s","6s"]
        headers = ["name","teamName","age","mvpPoints", "gamesPlayed", "inningsBowled",  "oversBowled", "runsConceded", "bowlingEconomy", "wickets", "bowlingAverage", "dotsBowled","foursConceded","sixesConceded"];
        inputValues = ["","","","","" ,"" ,"" ,"" , "","" ,"" , "","",""];
        sortPlayerRatings("mvpPoints");
        sortPlayerRatings("mvpPoints");

}
let viewBattingStats = () =>{
    sessionStorage.bowling = false;
    setHTML("standingsTitle","View Player Batting Stats");
    document.getElementById("switcher").innerHTML =`<div id="switcher"><button onclick = "viewBowlingStats()"> View Bowling Stats </button> </div>`;
    headerNames = ["Name","Team","Age","MVP","M", "Inn","Runs","BF","SR","Avg","NO","4s","6s"]
    headers = ["name","teamName","age","mvpPoints", "gamesPlayed", "inningsBatted",  "runsScored", "ballsFaced", "strikeRate", "battingAverage", "notOuts", "foursScored","sixesScored"];
    inputValues = ["","","","","" ,"" ,"" ,"" , "","" ,"" , "",""];
    sortPlayerRatings("mvpPoints");
    sortPlayerRatings("mvpPoints");
}

let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("playerStats", "viewPlayerStats");
    window.location.href = url;
}
let sortPlayerRatings = (item,noSort,filter) =>{
console.log(item)

if(noSort != "true"){
playerList.sort((a, b) => ((a[item] > b[item]) ? -1 :  1));
if(sessionStorage.rankingItem == item){playerList.sort((a, b) => ((a[item] > b[item]) ? 1 :  -1));}
}
let filteredList = playerList.map(element=> element);
filteredList = filteredList.filter(element=> 
    {
        console.log(element)
        let works = true;
        for(let i=0; i<headers.length;i++){
            console.log(element[headers[i]])
            if(element[headers[i]] == "NA"){
                works = false;
                i = element.length;
            }
        }
        if(works){
            return element;
        }
    }
    );
if(!(document.getElementById("filter"+headers[7])==undefined)){
for(let i=0; i< headers.length;i++){
    let input = document.getElementById("filter"+headers[i]).value;
    inputValues[i] = input;
    console.log(input)
    if(input[0]==">" ){
        if(input[1] != "="){
        let number = parseInt(input.substring(1,input.length));
        filteredList = filteredList.filter(element=>element[headers[i]]>number);
        }
        else{
            let number = parseInt(input.substring(2,input.length));
            filteredList = filteredList.filter(element=>element[headers[i]]>=number);
            
        }
    }
    else     if(input[0]=="<" ){
        if(input[1] != "="){
        let number = parseInt(input.substring(1,input.length));
        filteredList = filteredList.filter(element=>element[headers[i]]<number);
        }
        else{
            let number = parseInt(input.substring(2,input.length));
            filteredList = filteredList.filter(element=>element[headers[i]]<=number);
            
        }
    }
    else if(input == ""){}
    else{
        console.log("HI")
        filteredList = filteredList.filter(element=>{
            let works = true;
            for(let j=0; j<input.length;j++){
                
                if((input[j].toLowerCase() != element[headers[i]][j])&&(input[j].toUpperCase() != element[headers[i]][j])){
                    works = false;
                    j=input.length
                }
            }
            if(works){
                return element;
            }
        
        });
    }

}}
let standings = filteredList;
let standingsTable = "<div><table>";
standingsTable +="<tr class='standingsHeader'> ";
for(let i=0; i< headers.length;i++){
    standingsTable += `<th> <button class="rankingHeader" onclick = 'sortPlayerRatings("${headers[i]}")'>${headerNames[i]}</button> </th>`;
}
standingsTable += "</tr>";
standingsTable += "<tr>";
for(let i=0; i< headers.length;i++){
    standingsTable += `<th> <input id="filter${headers[i]}" class="filter" onkeyup = 'sortPlayerRatings("${item}","true","${headers[i]}")' value = "${inputValues[i]}"> </input> </th>`;
}
standingsTable += "</tr>";
for (let i = 0; i < standings.length; i++) {
    standingsTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewPlayerStats(" + standings[i].playerID + ")>" + standings[i].name + "</button>" + "</td>";
    standingsTable += "<td>" + "<button class ='viewPlayerStats' onclick=viewTeamStats(" + standings[i].teamID + ")>" + standings[i].teamName + "</button>" + "</td>";
 
    for(let h=2; h<headers.length;h++){
        if(isNumber(standings[i][headers[h]])){
            standingsTable += "<td>" +    Math.round(100*standings[i][headers[h]])/100 + "</td>";
        }
        else{
        standingsTable += "<td>" +    standings[i][headers[h]] + "</td>";}
    }
   
    standingsTable += "</tr>"
}
this.standings = standings;
setHTML("playerRatings", standingsTable)
if(sessionStorage.rankingItem != item){
sessionStorage.rankingItem = item;}
else{
    sessionStorage.rankingItem = "BLANK";
}

if(filter != undefined){
    let pork = document.getElementById("filter"+filter).value;
    document.getElementById("filter"+filter).value = "";
    document.getElementById("filter"+filter).focus();
    document.getElementById("filter"+filter).value = pork;
}

}



sortPlayerRatings("mvpPoints");
if(sessionStorage.bowling == "true"){
    viewBowlingStats();
}
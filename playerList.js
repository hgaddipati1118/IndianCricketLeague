sessionStorage.rankingItem = "BLANK";
let viewTeamStats = (id) => {
    sessionStorage.currentTeamView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("playerList", "viewTeam");
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
let headerNames = ["Name","Team","Age","Ovr","Bt Ovr", "Bwl Ovr","Biq","Pwr","Run","Tmg","Econ","Acc","Clt","Wkt"]
let headers = ["name","teamName","age","overall", "battingOverall", "bowlingOverall",  "battingIQ", "power", "running", "timing", "economy", "accuracy","clutch", "wicketTaking"];
let inputValues = ["","","","","" ,"" ,"" ,"" , "","" ,"" , "","","" ];
let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("playerList", "viewPlayerStats");
    window.location.href = url;
}
let sortPlayerRatings = (item,noSort,filter) =>{
console.log(item)

if(noSort != "true"){
playerList.sort((a, b) => ((a[item] > b[item]) ? -1 :  1));
if(sessionStorage.rankingItem == item){playerList.sort((a, b) => ((a[item] > b[item]) ? 1 :  -1));}
}
let filteredList = playerList.map(element=> element);
if(!(document.getElementById("filter"+headers[0])==undefined)){
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
                
                if((input[j].toLowerCase() != String(element[headers[i]])[j])&&(input[j].toUpperCase() != String(element[headers[i]])[j])){
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
            standingsTable += "<td>" +    Math.round(standings[i][headers[h]]) + "</td>";
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

if(filter.length > 0){
    let pork = document.getElementById("filter"+filter).value;
    document.getElementById("filter"+filter).value = "";
    document.getElementById("filter"+filter).focus();
    document.getElementById("filter"+filter).value = pork;
}

}



sortPlayerRatings("overall");
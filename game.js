let playerList = [];
let teams = [];

playerList = JSON.parse(localStorage.playerList)
for (let i = playerList.length - 1; i >= 0; i--) {
    let player = createPlayer(randInt(60, 100), i);
    player.remakePlayer(playerList[i]);
    playerList[i] = player;
}
teams = JSON.parse(localStorage.teams);
for (let i = teams.length - 1; i >= 0; i--) {
    let team = new Team(1, 1, 1, 1, 1);
    console.log(teams[i].battingLineup)
    team.remakeTeam(teams[i], playerList);
    teams[i] = team;
}
document.getElementById("team1Name").innerHTML = teams[sessionStorage.homeTeam].teamName;
document.getElementById("team2Name").innerHTML = teams[sessionStorage.awayTeam].teamName;
game = new Game(teams[sessionStorage.homeTeam], teams[sessionStorage.awayTeam], playerList);
console.log(teams[sessionStorage.homeTeam].battingLineup);

let runGame = () => {
    let schedule = JSON.parse(localStorage.schedule);
    if (sessionStorage.gameNumber < schedule.scorecards.length) {
        alert("Game has already been played")
        sessionStorage.scorecardToView = sessionStorage.gameNumber;
        let url = window.location.href;
        url = url.replace("game.html", "viewOldScorecard.html");
        window.location.href = url;
    }
    else{
    game.runGame();
    /* Stuff to release plays by time
    alert("before setInterval"); //called first
    let playLog =  game.playLog;
    let count = 0;
 var tid = setInterval(function(){
        count = count +1;
        console.log("count")
        let playLogTotal = [];
        for(let i = 0;i<count; i++){
            playLogTotal.push(playLog[playLog.length-1-i])
        }
        document.getElementById("playbyplay").innerHTML = playLogTotal.reverse().join("<br>");
        //called 5 times each time after one second  
      //before getting cleared by below timeout. 
       
   },1000); //delay is in milliseconds 

  alert("after setInterval"); //called second

setTimeout(function(){
     clearInterval(tid); //clear above interval after 5 seconds
},1000*100); */
    document.getElementById("playbyplay").innerHTML = game.playLog.reverse().join("<br>");
    console.log(game.scorecard)
    game.scorecardHTML();
    
    console.log(schedule.gameNumber)
    if (sessionStorage.gameNumber >= schedule.scorecards.length) {
    schedule.scorecards.push(game.scorecard);
    localStorage.schedule = JSON.stringify(schedule);
    console.log(JSON.parse(localStorage.schedule))}
    }

}
if (sessionStorage.autoPlay > 0) {
    runGame();
    let url = window.location.href.toLowerCase();
    url = url.replace("game.html", "season.html");
    window.location.href = url;
}
let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;

    let url = window.location.href;
    url = url.replace("game.html", "viewPlayerStats.html");
    window.location.href = url;
}
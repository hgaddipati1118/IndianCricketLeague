let playerList = [];
let teams = [];
let teamViewingNumber = sessionStorage.currentTeamView;
sessionStorage.rosters = "zilch";
let viewPlayerStats = (id) => {
    sessionStorage.currentPlayerView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("viewgamelog", "viewplayerstats");
    window.location.href = url;
}
let viewTeamStats = (id) => {
    sessionStorage.currentTeamView = id;
    console.log(id);

    let url = window.location.href;
    url = url.replace("viewgamelog", "viewteam");
    window.location.href = url;
}
playerList = JSON.parse(localStorage.playerList)

for (let i = playerList.length - 1; i >= 0; i--) {
    let player = createPlayer(randInt(60, 100), i);
    player.remakePlayer(playerList[i]);
    playerList[i] = player;
}
teams = JSON.parse(localStorage.teams);
let teamViewing = 0;
for (let i = teams.length - 1; i >= 0; i--) {
    let team = new Team(1, 1, 1, 1, 1);
    team.remakeTeam(teams[i], playerList);
    teams[i] = team;
    if (team.teamID != localStorage.userTeam) {
        team.autoSortLineups();
    }
    if(team.teamID == teamViewingNumber){
        teamViewing = team;
    }
}
schedule = new Schedule(teams, true);
let scheduleOld = JSON.parse(localStorage.schedule);

schedule.remakeSchedule(scheduleOld);
document.getElementById("teamName").innerHTML = "<div onclick=viewTeamStats(" + teamViewing.teamID + ")>" + teamViewing.teamName + "</div>";
document.getElementById("schedule").innerHTML= schedule.gameLogOutput(teamViewingNumber);

let scorecardClick = (i) => {
    sessionStorage.scorecardToView = i;
    let url = window.location.href;
    url = url.replace("viewgamelog", "viewoldscorecard");
    window.location.href = url;
}
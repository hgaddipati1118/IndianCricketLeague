testPlayer = new CricketPlayer("John James", 22, "India", 66, 77, 81, 58, 91, 82, 44, 33);
let playerList = [];
let teamNames = ["Hyderabad", "Dehli", "Bangalore", "Kolkata", "Rajhastan", "Chennai", "Mumbai", "Punjab"];
let teamColors1 = ["#f7a721", "#2561ae", "#EC1C24", "#2E0854", "#CBA92B", "#FFFF3C", "#004BA0", "#DCDDDF"];
let teamColors2 = ["#000000", "#EF1B23", "#2b2a29", "#b3a123", "#254aa5", "#0081E9", "#D1AB3E", "#ED1B24"];
let teams = [];
localStorage.clear();
if (localStorage.testPlayers == undefined) {
    for (let i = 0; i < 300; i++) {
        playerList.push(createPlayer(100, i));
    }
    localStorage.testPlayers = JSON.stringify(playerList);
    for (let i = 0; i < teamNames.length; i++) {
        teams.push(new Team(teamNames[i], teamColors1[i], teamColors2[i], i, playerList));
    }
    /*
        for (let i = 0; i < playerList.length; i++) {
            if (teams[i % 8].countPlayers() < 25) {
                teams[i % 8].addPlayer(playerList[i]);
            }
        }
        localStorage.teams = JSON.stringify(teams);*/
} else {
    playerList = JSON.parse(localStorage.testPlayers)
    teams = JSON.parse(teams);
}
let currentPlayer = playerList[1];
let schedule = new Schedule(teams);
console.log(currentPlayer);
currentPlayer.prog();
console.log(currentPlayer)
let newPlayer = createPlayerNew(100)
console.log(newPlayer)
    /*testAuction = new Auction(playerList, teams);
    testAuction.playerAuction(0);
    testAuction.simWholeAuction();
    console.log(testAuction.auctionRecord)
    for (let i = 0; i < teams.length; i++) {
        teams[i].autoSortBatting();
        teams[i].autoSortBowling();
    }
    testGame = new Game(teams[0], teams[1], playerList);
    testGame.runGame();
    document.getElementById("playLog").innerHTML = testGame.playLog; */
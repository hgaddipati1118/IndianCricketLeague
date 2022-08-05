class Auction {
    constructor(playerList, teams, htmlElementIDs, userTeam) {
        this.auctionList = playerList.sort((a, b) => (a.value > b.value) ? -1 : 1).filter(a=>!(isNumber(a.teamID)));
        this.currentPlayer = 0;
        this.teams = teams;
        this.teamOn = 0;
        this.userTeam = userTeam;
        this.currentBid = 0.05;
        if(sessionStorage.rosters != "2021"){
            this.currentBid = 0.2;
        }
        this.auctionRecord = [];
        this.htmlElementIDs = htmlElementIDs;
        this.currentTeamList = this.teams.map(element => element);
        if (localStorage.auctionRecord != undefined && localStorage.auctionRecord != "NEW") {
            this.auctionRecord = JSON.parse(localStorage.auctionRecord);
        }
        console.log(localStorage.auctionRecord)
        if(sessionStorage.rosters == "2022"||sessionStorage.rosters == "2021"){
            this.finishSetup();
        }else{
        this.setUpForPlayerAuction();
        giveTeamRoster();}
    }
    setUpForPlayerAuction(autoAuction) {
        localStorage.playerList = JSON.stringify(playerList);
        localStorage.auctionRecord = JSON.stringify(this.auctionRecord);
        localStorage.teams = JSON.stringify(this.teams);
        console.log(this.auctionList.length)
    
        let player = this.auctionList[this.currentPlayer];
        console.log(player, this.currentPlayer)
        while (isNumber(player.teamID)) {
            this.currentPlayer++;
            console.log(player.teamID)
            console.log(this.currentPlayer);
            player = this.auctionList[this.currentPlayer];
        }
        this.teamOn = this.currentPlayer % this.teams.length;
        this.currentBid = 0.05;
        if(sessionStorage.rosters != "2021"){
            this.currentBid = 0.2;
        }
        for (let i = teams.length - 1; i >= 0; i--) {
            teams[i].calcSalary(this.auctionList);
        }
        this.currentTeamList = this.teams.filter(element => (element.teamSalary < 90 && element.playerList.length < 25));
        if (this.currentTeamList.every(element => element.teamID != this.userTeam) && (this.autoAuction != true)) {
            if((sessionStorage.rosters != "2022"||sessionStorage.rosters != "2021")){
            alert("Your team is done with auction, auction will be simmed")}
            sessionStorage.bidProcessing = 0;
            this.setUpForNextSeason();
        }
        if (player.international) {
            this.currentTeamList = this.currentTeamList.filter(element => element.countInternational() < 8);
        }
        if (this.currentTeamList.every(element => element.teamID != this.userTeam) && (this.autoAuction != true)) {
            if(sessionStorage.internationalAlert == "false"){
                sessionStorage.internationalAlert = "true";
            alert("Your team has reached the international player max, all future international players will be simmed")}
            this.simPlayerAuction(true);
        }

        this.updateListForNextPlayer();
        console.log(player)
        if (this.autoAuction != true) {
            this.simIncompleteRound(player);
        }
    }
    dropUserBid() {
        this.currentTeamList = this.currentTeamList.filter(element => element.teamID != this.userTeam);
        this.simPlayerAuction(true);

    }
    simIncompleteRound(player) {
        if(this.teamOn>=this.currentTeamList.length){
            this.teamOn = Math.floor(Math.random()*this.currentTeamList.length);
        }
        console.log(this.teamOn)
        while (this.currentTeamList[this.teamOn].teamID != this.userTeam) {
            this.teamOn++;
           
            this.currentTeamList = this.currentTeamList.filter(element => (element.teamSalary < (90 - this.currentBid)));
            this.teamOn = this.teamOn % this.currentTeamList.length;
            if (this.currentTeamList[this.teamOn].teamID != this.userTeam) {
                let currentTeam = this.teams[this.teamOn];
                if (this.playerBidOdds(this.currentBid)) {

                    this.currentBid += 0.05;
                } else {
                    this.currentTeamList.splice(this.teamOn, 1);
                    i--;

                }
            }
        }
        if (this.currentTeamList.every(element => element.teamID != this.userTeam)) {
            alert("You can't bid on this player")
            this.simPlayer();
        }
        this.updateListForNextBid();
        if (this.currentTeamList.length == 1) {
            player.teamID = this.currentTeamList[0].teamID;
            player.bid = round(this.currentBid, 2);
            teams[player.teamID].playerList.push(player.playerID);
            this.auctionRecord.push({
                "player": player.playerID,
                "teamID": this.currentTeamList[0].teamID
            });

            this.currentPlayer++;
            console.log(this.currentPlayer)
            this.setUpForPlayerAuction();
            giveTeamRoster();
        }
    }
    simTillUserTeam() {
        let player = this.auctionList[this.currentPlayer];
        if (!(isNumber(player.teamID))) {
            for (let i = 0; i < this.currentTeamList.length; i++) {
                this.currentTeamList = this.currentTeamList.filter(element => (element.teamSalary < (90 - this.currentBid)));
       
                this.teamOn = i + this.userTeam;
               
                this.teamOn = this.teamOn % this.currentTeamList.length;
   
                if (this.currentTeamList[this.teamOn].teamID != this.userTeam) {
                      console.log(i)

                    if (this.playerBidOdds(this.currentBid)) {
                    
                        this.currentBid += 0.05;
                    } else {
                        this.currentTeamList.splice(this.teamOn, 1);
                        i--;

                    }
                }
            }

        }
        if (this.currentTeamList.every(element => element.teamID != this.userTeam)) {
            alert("You can't bid on this player")
            this.simPlayer();
        }

        this.updateListForNextBid();
        if (this.currentTeamList.length == 1) {
            player.teamID = this.currentTeamList[0].teamID;
            player.bid = round(this.currentBid, 2);
            teams[player.teamID].playerList.push(player.playerID);
            this.auctionRecord.push({
                "player": player.playerID,
                "teamID": this.currentTeamList[0].teamID
            });
            
            this.setUpForPlayerAuction();
            giveTeamRoster();
        }
    }
    userBid() {
      

        if (this.currentTeamList.some(element => element.teamID == this.userTeam)) {
            this.currentBid += 0.05;
            this.teamOn++;
           
            this.teamOn = this.teamOn % this.currentTeamList.length;
            this.simTillUserTeam();
        } else {
            alert("Can't bid on this player")
            sessionStorage.bidProcessing = 0;
            this.simPlayerAuction();
        }
            sessionStorage.bidProcessing = 0;

    }
    dropUserBid() {
        for (let i = 0; i < this.currentTeamList.length; i++) {
            if (this.currentTeamList[i].teamID == this.userTeam) {
                this.currentTeamList.splice(i, 1);
                break;
            }
        }
        this.simPlayerAuction();
    }
    simPlayerAuction() {

        let player = this.auctionList[this.currentPlayer];
        if (!(isNumber(player.teamID))) {
            while (this.currentTeamList.length > 1) {
                let currentTeam = this.teams[this.teamOn];
                if (this.playerBidOdds(this.currentBid)) {

                    this.currentBid += 0.05;
                } else {
                    this.currentTeamList.splice(this.teamOn, 1);
                }

                this.currentTeamList = this.currentTeamList.filter(element => (element.teamSalary < (90 - this.currentBid)));
                this.teamOn++;
                this.teamOn = this.teamOn % this.currentTeamList.length;
                this.updateListForNextBid();


            }
            if (this.currentTeamList[0] != undefined) {


                player.teamID = this.currentTeamList[0].teamID;
                player.bid = round(this.currentBid, 2);
                teams[player.teamID].playerList.push(player.playerID);
                this.auctionRecord.push({
                    "player": player.playerID,
                    "teamID": this.currentTeamList[0].teamID
                })
            }
        }
     
        this.currentPlayer++;
        console.log(this.currentPlayer)
        this.setUpForPlayerAuction();
        giveTeamRoster();




    }
    simWholeAuction() {
            while (!(this.teams.every(element => ((0.05 + element.teamSalary) > 90 || element.playerList.length > 24))) && this.currentPlayer < (this.auctionList.length - 5)) {
                console.log(this.teams)
                this.autoAuction = true;
                this.simPlayerAuction(this.currentPlayer);
            }

        }
        //Determines percent odds cpu team bids on player
    playerBidOdds(bid) {
        let player = this.auctionList[this.currentPlayer];
        let oddsOfBid = (1 - (bid / (10 * player.calcValue()))) * (1 - 0.1 * (this.currentPlayer / this.auctionList.length));
        let ageAdjust = Math.pow(Math.abs(30 - player.age) / 30, 3);
        if (player.age > 30) {
            ageAdjust = 0 - ageAdjust;
        }
        //Boost for Indian Players
        if (!this.auctionList[this.currentPlayer].international) {
            oddsOfBid = oddsOfBid + Math.pow(((1 - oddsOfBid) * 0.05), 0.8);
        }
        if (oddsOfBid > 0.979) {
            oddsOfBid = 0.979;
        }
        return ((Math.random()) < (oddsOfBid + ((1 - oddsOfBid) * ageAdjust)))
    }
    updateListForNextBid() {
        setHTML(this.htmlElementIDs.teamsLeft, this.currentTeamList.map(element => element.teamName).join("<br>"));
        setHTML(this.htmlElementIDs.currentBid, round(this.currentBid, 2));
    }
    updateListForNextPlayer() {
        let upNextPlayers = [];
        let lastPlayerShown = 101;
        if ((this.auctionList.length - this.currentPlayer) <= 101) {
            lastPlayerShown = (this.auctionList.length - this.currentPlayer)
        }
        for (let i = this.currentPlayer + 1; i < this.currentPlayer + lastPlayerShown; i++) {
            let dumpString = "";
            let asterik = "";
            let currentPlayer = this.auctionList[i];
            if (currentPlayer.international) {
                asterik = "*";
            }
            dumpString = "<b>" + currentPlayer.name + asterik + "</b> (Ovr:" + Math.round(currentPlayer.overall) + ", Age: " + currentPlayer.age + ")<br>";
            upNextPlayers.push(dumpString);
        }
        setHTML(this.htmlElementIDs.playersUpNext, upNextPlayers.join(""));
        let playersDone = [];
        for (let i = this.auctionRecord.length - 1; i >= 0; i--) {
            let dumpString = "";
            let asterik = "";
            let currentPlayer = this.findPlayer(this.auctionRecord[i].player);
            if (currentPlayer == undefined) {
                continue;
            }
            if (currentPlayer.international) {
                asterik = "*";
            }
            dumpString = "<b>" + currentPlayer.name + asterik + "</b>" + "  (" + this.teams[currentPlayer.teamID].teamName + ", " + round(currentPlayer.bid, 2) + " crores)<br>";
            playersDone.push(dumpString);
        }
        setHTML(this.htmlElementIDs.soldPlayers, playersDone.join(""));
        this.updateListForNextBid();
        let currentPlayer = this.auctionList[this.currentPlayer];
        let name = currentPlayer.name;
        if (currentPlayer.international) {
            name = name + "*";
        }
        setHTML(this.htmlElementIDs.playerName, name);
        setHTML(this.htmlElementIDs.playerOverall, "Overall: " + Math.round(currentPlayer.overall));
        setHTML(this.htmlElementIDs.playerAge, "Age: " + currentPlayer.age);
        setHTML(this.htmlElementIDs.playerBowlingOverall, "Bowling Overall: " + Math.round(currentPlayer.bowlingOverall));
        setHTML(this.htmlElementIDs.playerBattingOverall, "Batting Overall: " + Math.round(currentPlayer.battingOverall));
        setHTML(this.htmlElementIDs.playerEconomy, "Economy: " + currentPlayer.economy);
        setHTML(this.htmlElementIDs.playerWicketTaking, "Wicket Taking: " + currentPlayer.wicketTaking);
        setHTML(this.htmlElementIDs.playerClutch, "Clutch: " + currentPlayer.clutch);
        setHTML(this.htmlElementIDs.playerAccuracy, "Accuracy: " + currentPlayer.accuracy);
        setHTML(this.htmlElementIDs.playerBattingIQ, "Batting IQ: " + currentPlayer.battingIQ);
        setHTML(this.htmlElementIDs.playerTiming, "Timing: " + currentPlayer.timing);
        setHTML(this.htmlElementIDs.playerPower, "Power: " + currentPlayer.power);
        setHTML(this.htmlElementIDs.playerRunning, "Running: " + currentPlayer.running);

    }
    findPlayer(playerID) {
        for (i = 0; i < this.auctionList.length; i++) {
            if (this.auctionList[i].playerID == playerID) {
                return this.auctionList[i];
            }
        }
    }
    setUpForNextSeason() {
        sessionStorage.bidProcessing = 0;
        this.simWholeAuction();
       
        this.finishSetup();
    }
    finishSetup() {
        sessionStorage.bidProcessing = 0;
        this.currentPlayer = 0;
        for (let i = teams.length - 1; i >= 0; i--) {
            if ((teams[i].playerList.length - teams[i].countInternational()) < 15) {
                while ((teams[i].playerList.length - teams[i].countInternational()) < 15) {
                    this.currentPlayer++;
                    if (!(this.auctionList[this.currentPlayer].international || isNumber(this.auctionList[this.currentPlayer].teamID))) {
                        teams[i].playerList.push(this.auctionList[this.currentPlayer].playerID);
                        this.auctionList[this.currentPlayer].bid = 0.05;
                        if(sessionStorage.rosters != "2021"){
                            this.auctionList[this.currentPlayer].bid = 0.2;
                        }
                        this.auctionList[this.currentPlayer].teamID = teams[i].teamID;
                    }
                }
            };
        }
        if((sessionStorage.rosters != "2022"||sessionStorage.rosters != "2021")){
            
        for (let i = playerList.length - 1; i >= 0; i--) {

            playerList[i].prog();


        }}
        else{
          
            for (let i = playerList.length - 1; i >= 0; i--) {

                playerList[i].fakeProg();
    
    
            }
        }
        for (let i = teams.length - 1; i >= 0; i--) {
            teams[i].autoSortLineups();
        }
        
        
        
        let sortedList = playerList.sort((a, b) => (a.calcValue() > b.calcValue()) ? -1 : 1).filter(a=>!(isNumber(a)));
        let playersCut = 0;
        let i = sortedList.length-1;
        let playersToCut = sortedList.length -1000;
        
        while(playersCut<playersToCut){
            let currentPlayer = sortedList[i];
            console.log(currentPlayer)
            if(!(isNumber(currentPlayer.teamID))){
            for(let g=0;g<playerList.length;g++){
                if(playerList[g].playerID == sortedList[i].playerID){
                    playerList.splice(g,1);
                    playersCut+=1;
                }
            }
        }
        i -= 1;
        
    }
    localStorage.teams = JSON.stringify(this.teams);
    localStorage.playerList = JSON.stringify(playerList);
        let schedule = new Schedule(this.teams);
        localStorage.schedule = JSON.stringify(schedule);
        let url = window.location.href.toLowerCase();
        url = url.replace("auction", "season");
        window.location.href = url;
        console.log(playerList)
        console.log(teams)
    }
}
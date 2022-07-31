class Team {
    constructor(teamName, primaryColorHexcode, secondaryColorHexcode, teamID, playerList) {
        this.teamName = teamName;
        this.teamID = teamID;
        this.teamSalary = 0;
        this.primaryColorHexcode = primaryColorHexcode;
        this.secondaryColorHexcode = secondaryColorHexcode;
        this.homeAdvantage = randInt(70, 150) / 100;
        this.playerList = [];
    }
    remakeTeam(team, playerList) {
        this.homeAdvantage = team.homeAdvantage;
        this.playerList = [];
        this.teamID = team.teamID;
        if(sessionStorage.rosters == "2021"){
        for(let i=0; i<playerList.length;i++){
            if(playerList[i].teamID == this.teamID){
                this.playerList.push(playerList[i].playerID);
            }
        }}
        else{
     
            this.playerList = team.playerList;
        }
        
        this.primaryColorHexcode = team.primaryColorHexcode;
        this.secondaryColorHexcode = team.secondaryColorHexcode;
        this.teamName = team.teamName;
        this.teamSalary = team.teamSalary;
        this.battingLineup = team.battingLineup;
        this.bowlingOrder = team.bowlingOrder;
        this.wins = team.wins;
        this.losses = team.losses;
        this.netRunRate = team.netRunRate;
    }
    calcSalary() {
        let salary = 0;
        for (let i = this.playerList.length - 1; i >= 0; i--) {
            for (let g = playerList.length - 1; g >= 0; g--) {
                if (playerList[g].playerID == this.playerList[i]) {
                    salary += playerList[g].bid;
                    continue;
                }

            }
        }
        this.teamSalary = salary;
    }

    addPlayer(player) {
        this.playerList.push(player.playerID);
    }
    countPlayers() {
        return this.playerList.length;
    }

    countInternational() {
        let internationals = 0;
        for (let i = 0; i < this.playerList.length; i++) {
            for (let g = playerList.length - 1; g >= 0; g--) {
                if (this.playerList[i] == playerList[g].playerID) {
                    if (playerList[g].international) {
                        internationals++;
                    }
                    continue;
                }
            }
        }

        return internationals;
    }
    countInternationalInLineup() {
        let internationals = 0;
        for (let i = 0; i < 11; i++) {
            for (let g = playerList.length - 1; g >= 0; g--) {
                if (this.playerList[i] == playerList[g].playerID) {
                    if (playerList[g].international) {
                        internationals++;
                    }
                    continue;
                }
            }
        }

        return internationals;
    }
    autoSortLineups() {
        this.autoSortBatting();
        this.autoSortBowling();
    }
    autoSortLineupsHealthy() {
        this.autoSortHealthyBatting();
        this.autoSortBowling();
    }
    findPlayer(id) {
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].playerID == id) {
                return (playerList[i])
            }
        }
    }
    autoSortBatting() {
        this.playerList.sort((a, b) => this.findPlayer(a).overall > this.findPlayer(b).overall ? -1 : 1);
        for(let i=0; i< 11; i++){
            if(this.findPlayer(this.playerList[i]).injury>0){
                let valueTakenOut = this.playerList.map(element => element)[i];
                let replacementPlayer = 11;
                while ( this.findPlayer(this.playerList[replacementPlayer]).injury > 0 ) {
                    replacementPlayer++;
                }
                this.playerList[i] = this.playerList[replacementPlayer];
                this.playerList[replacementPlayer] = valueTakenOut;
            
            }
        }
        let numberOfInternational = 0;
        for (let i = 0; i < 11; i++) {
            if (this.findPlayer(this.playerList[i]).international) {
                numberOfInternational++;
            }
            if (numberOfInternational > 4) {
                let valueTakenOut = this.playerList.map(element => element)[i];
                let replacementPlayer = 11;
                while (this.findPlayer(this.playerList[replacementPlayer]).international || this.findPlayer(this.playerList[replacementPlayer]).injury > 0 ) {
                    replacementPlayer++;
                }
                this.playerList[i] = this.playerList[replacementPlayer];
                this.playerList[replacementPlayer] = valueTakenOut;
            }
        }
        let sortedBattingList = this.playerList.map(element=>element);
        sortedBattingList.length = 11;
        sortedBattingList.sort((a, b) => this.findPlayer(a).battingOverall > this.findPlayer(b).battingOverall ? -1 : 1);
        for (let i = 0; i < 11; i++) {
            this.playerList[i] = sortedBattingList[i];
        }
        this.setbattingLineup(sortedBattingList);

    }
    autoSortHealthyBatting() {
        this.playerList.sort((a, b) => this.findPlayer(a).overall > this.findPlayer(b).overall ? -1 : 1);
        let numberOfInternational = 0;
        for (let i = 0; i < 11; i++) {
            if (this.findPlayer(this.playerList[i]).international) {
                numberOfInternational++;
            }
            if (numberOfInternational > 4) {
                let valueTakenOut = this.playerList.map(element => element)[i];
                let replacementPlayer = 11;
                while (this.findPlayer(this.playerList[replacementPlayer]).international ) {
                    replacementPlayer++;
                }
                this.playerList[i] = this.playerList[replacementPlayer];
                this.playerList[replacementPlayer] = valueTakenOut;
            }
        }
        let sortedBattingList = this.playerList.map(element=>element);
        sortedBattingList.length = 11;
        sortedBattingList.sort((a, b) => this.findPlayer(a).battingOverall > this.findPlayer(b).battingOverall ? -1 : 1);
        for (let i = 0; i < 11; i++) {
            this.playerList[i] = sortedBattingList[i];
        }
        this.setbattingLineup(sortedBattingList);

    }
    setbattingLineup(lineup) {
        this.battingLineup = lineup;
    }
    autoSortBowling() {
        let sortedBowlingList = copy(this.battingLineup);
        sortedBowlingList.sort((a, b) => this.findPlayer(a).bowlingOverall > this.findPlayer(b).bowlingOverall ? -1 : 1);
        
        sortedBowlingList.length = 5;
        let bowlingOptions = [0, 1, 2, 3, 4];
        let bowlingOrder = [];
        let previousBowler = "-1";
        while (bowlingOrder.length < 20) {
            let currentBowlerNumber = Math.floor(bowlingOptions.length * Math.random());
            let currentBowler = bowlingOptions[currentBowlerNumber];
            if (bowlingOptions.length == 1 && bowlingOrder.length < 19) {
                if (bowlingOptions[0] != bowlingOrder[0]) {
                    bowlingOptions.push(bowlingOrder[0]);
                    bowlingOrder.splice(0, 1);
                } else {
                    bowlingOptions.push(bowlingOrder[1]);
                    bowlingOrder.splice(1, 1);
                }
            }
            while (currentBowler == previousBowler) {
                currentBowlerNumber = Math.floor(bowlingOptions.length * Math.random());
                currentBowler =
                    bowlingOptions[currentBowlerNumber];
            }
            if (countTimesIn(bowlingOrder, currentBowler) > 2) {
                bowlingOptions.splice(currentBowlerNumber, 1);
            }
            bowlingOrder.push(currentBowler);
            previousBowler = currentBowler;
        }
        let bowlingLineup = [];
        for (i = 0; i < bowlingOrder.length; i++) {
            bowlingLineup.push(sortedBowlingList[bowlingOrder[i]]);
        }
        this.setBowlingOrder(bowlingLineup);

    }
    setBowlingOrder(lineup) {
        this.bowlingOrder = lineup;
        console.log(lineup)
    }
}
//import { NormSInv, normalDist } from './functions.js';


class CricketPlayer {
    constructor(name, age, country, playerID, economy, wicketTaking, clutch, accuracy, battingIQ, timing, power, running) {
        this.name = name;
        this.age = age;
        this.country = country;
        if (this.country == "India") {
            this.international = false;
        } else {
            this.international = true;
        }
        this.economy = economy;
        this.wicketTaking = wicketTaking;
        this.clutch = clutch;
        this.accuracy = accuracy;
        this.battingIQ = battingIQ;
        this.timing = timing;
        this.power = power;
        this.running = running;
        this.playerID = playerID;
        this.teamID = "FA";
        this.bid = 0;
        this.stats = [];
        this.calcOveralls();
    }
    remakePlayer(player) {
        let values = ["accuracy", "battingOverall", "bowlingOverall", "overall", "battingIQ", "clutch", "economy", "power", "running", "timing", "wicketTaking"];
        for (let i = values.length - 1; i >= 0; i--) {
            this[values[i]] = player[values[i]];
            this[values[i] + "Prog"] = player[values[i] + "Prog"];
        }
        this.age = player.age;
        this.bid = player.bid;
        this.country = player.country;
        this.economy = player.economy;
        this.international = player.international;
        this.name = player.name;
        this.playerID = player.playerID;
        this.stats = player.stats;
        this.teamID = player.teamID;
        this.value = player.value;
        this.injury = player.injury;
        this.refused = player.refused;
        this.calcValue();

    }
    traitProg(trait, prog, ageAdjuster) {
        let boost = (NormSInv(normalDist()) + ageAdjuster) * (prog);
        trait = trait + boost;
        if (trait > 99) {
            boost = boost - (trait - 99);
            trait = 99;
        }
        if (trait <= 0) {
            boost = boost + (0 - boost);
            trait = 0;
        }
        boost = Math.round(boost);
        return boost;

    }
    traitProgText(boost) {
        if (boost > 0) {
            boost = " (" + "+" + boost + ")";
        } else if (boost < 0) {
            boost = " (" + boost + ")";
        } else {
            boost = "";
        }
        return boost;

    }
    calcValue() {
        this.calcOveralls();
        let value = Math.pow((this.overall-50) / 50,1.8)* Math.pow((30 / this.age),0.5);
        value = Math.pow(value,4);
        value = value*150;
        if (this.international) {
            value = value * 0.5;
        }
        this.value = value;
        return value;
    }
    calcOveralls() {
        this.battingOverall = this.timing * 0.3 + this.power * 0.3 + this.battingIQ * 0.35 + this.running * 0.05;
        this.bowlingOverall = this.wicketTaking * 0.4 + this.economy * 0.4 + this.accuracy * 0.1 + this.clutch * 0.1;
        if ((this.battingOverall) > this.bowlingOverall) {
            this.overall = this.battingOverall + (100 - this.battingOverall) * Math.pow((this.bowlingOverall / 100), 4)
        } else {
            this.overall = this.bowlingOverall + (100 - this.bowlingOverall) * Math.pow((this.battingOverall / 100), 4)

        }
        this.battingOverall = round(this.battingOverall, 2);
        this.bowlingOverall = round(this.bowlingOverall, 2);
        this.overall = round(this.overall, 2);
    }



    prog() {
        let oldBattingOverall = this.battingOverall;
        let oldBowlingOverall = this.bowlingOverall;
        let oldOverall = this.overall;
        let age = this.age;
        let progDev = Math.pow(Math.pow(30 - age, 2), 0.7);
        let overallAdjuster = 1;
        if (age < 26) {
            overallAdjuster = ((100 - this.overall) / 50);
        }
        let ageAdjuster = ((Math.pow(30, 0.35) - Math.pow(age, 0.35)) / Math.pow(18, 0.35)) * overallAdjuster;
        this.timingProg = this.traitProg(this.timing, progDev, ageAdjuster);
        this.timing += this.timingProg;
        this.timingProg = this.traitProgText(this.timingProg);
        this.battingIQProg = this.traitProg(this.battingIQ, progDev, ageAdjuster);
        this.battingIQ += this.battingIQProg;
        this.battingIQProg = this.traitProgText(this.battingIQProg);
        this.powerProg = this.traitProg(this.power, progDev, ageAdjuster);
        this.power += this.powerProg;
        this.powerProg = this.traitProgText(this.powerProg);
        this.runningProg = this.traitProg(this.running, progDev, ageAdjuster);
        this.running += this.runningProg;
        this.runningProg = this.traitProgText(this.runningProg);
        this.accuracyProg = this.traitProg(this.accuracy, progDev, ageAdjuster);
        this.accuracy += this.accuracyProg;
        this.accuracyProg = this.traitProgText(this.accuracyProg);
        this.clutchProg = this.traitProg(this.clutch, progDev, ageAdjuster);
        this.clutch += this.clutchProg;
        this.clutchProg = this.traitProgText(this.clutchProg);
        this.economyProg = this.traitProg(this.economy, progDev, ageAdjuster);
        this.economy += this.economyProg;
        this.economyProg = this.traitProgText(this.economyProg);
        this.wicketTakingProg = this.traitProg(this.wicketTaking, progDev, ageAdjuster);
        this.wicketTaking += this.wicketTakingProg;
        this.wicketTakingProg = this.traitProgText(this.wicketTakingProg);
        this.calcOveralls();
        this.battingOverallProg = this.traitProgText(Math.round(this.battingOverall - oldBattingOverall));
        this.bowlingOverallProg = this.traitProgText(Math.round(this.bowlingOverall - oldBowlingOverall));
        this.overallProg = this.traitProgText(Math.round(this.overall - oldOverall));
        this.calcValue();
        this.age += 1;
    }
    fakeProg() {
        
        this.timingProg = "";
        this.battingIQProg = "";
        this.powerProg = "";
        this.runningProg = "";
        this.accuracyProg = "";
        this.clutchProg = "";
        this.economyProg = "";
        this.wicketTakingProg = "";
        this.calcOveralls();
        this.battingOverallProg = "";
        this.bowlingOverallProg = "";
        this.overallProg = "";
        this.calcValue();
        this.age += 0;
    }

}
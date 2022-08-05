let countryNames = ["South Africa", "Australia", "Sri Lanka", "West Indies", "New Zealand", "England", "Afghanistan", "Bangladesh", "Netherlands", "USA", "Zimbabwe"];
let countryPlayerCount = [53, 55, 39, 34, 24, 22, 19, 6, 1, 3, 1];
let totalPlayers = sum(countryPlayerCount);
let countryOdds = [countryPlayerCount[0] / totalPlayers];
let countryOddsNew = [0.02659574468,0.02700490998,0.08346972177,0.3359247136,0.4852700491,0.5257774141,0.629705401,0.6350245499,0.6423895254,0.6485270049,0.7049918167,0.8105564648,0.8158756137,0.8428805237,0.8494271686,0.9304418985,0.9496726678,0.9570376432,0.9644026187,0.9713584288,0.9779050736,0.9832242226,0.9914075286,0.9995908347]
let countryNamesNew = ['West Indies','Singapore','Pakistan','India','Sri Lanka','New Zealand','England','Bermuda','Afghanistan','Canada','Australia','South Africa','Nepal','Zimbabwe','Namibia','Bangladesh','Ireland','Scotland','United Arab Emirates','Kenya','Oman','Papua New Guinea','Netherlands','United States of America']
for (i = 1; i < countryNames.length; i++) {
    countryOdds.push(countryOdds[i - 1] + (countryPlayerCount[i] / totalPlayers));

}
let determineCountry = () => {
    let countryNumber = Math.random();
    for (i = 0; i < countryNames.length; i++) {
        if (countryOdds[i] > countryNumber) {
            return (countryNames[i]);
        }
    }
}
let determineCountryNew = () =>{
        let countryNumber = Math.random();
        for (i = 0; i < countryNamesNew.length; i++) {
            if (countryOddsNew[i] > countryNumber) {
                return (countryNamesNew[i]);
            }
        }

}
let randIntN = (mean,stdev, max, min)=>{
    let value = (NormSInv(normalDist())*stdev)+mean;
    if(value>max){
        value = max;
    }
    else if(min>value){
        value = min;
    }

    return Math.round(value);
}
let createPlayerNew = (id) =>{
    let country = determineCountryNew();
    let name = internationalNames[randInt(0, internationalNames.length - 1)] + " " + internationalNames[randInt(0, internationalNames.length - 1)];
    let age = Math.round(randIntN(18, 3,45,16));
    let economy = randIntN(55,15,99,1);
    let wicketTaking = randIntN(economy,15,99,1);
    let clutch = randIntN(wicketTaking,15,99,1);
    let accuracy = randIntN(clutch,15,99,1);
    let battingIQ = randIntN(55,15,99,1);
    let timing = randIntN(battingIQ,15,99,1);
    let power = randIntN(timing,15,99,1);
    let running = randIntN(timing,15,99,1);
    let battingOverall = timing * 0.3 + power * 0.3 + battingIQ * 0.35 + running * 0.05;
    let bowlingOverall = wicketTaking * 0.4 + economy * 0.4 + accuracy * 0.1 + clutch * 0.1;
    if(battingOverall > bowlingOverall && Math.random()>0.3){
       economy = randIntN(15,15,99,1);
      wicketTaking = randIntN(economy,15,99,1);
         clutch = randIntN(wicketTaking,15,99,1);
      accuracy = randIntN(clutch,15,99,1)
    }
    if(bowlingOverall > battingOverall && Math.random()>0.3){
     battingIQ = randIntN(15,15,99,1);
       timing = randIntN(battingIQ,15,99,1);
power = randIntN(timing,15,99,1);
       running = randIntN(timing,15,99,1);
     }
    let overall = 0;
    if ((battingOverall) > bowlingOverall) {
        overall = battingOverall + (100 - battingOverall) * Math.pow((bowlingOverall / 100), 4)
    } else {
        overall = bowlingOverall + (100 - bowlingOverall) * Math.pow((battingOverall / 100), 4)

    }


    let player = new CricketPlayer(name, age, country, id, economy, wicketTaking, clutch, accuracy, battingIQ, timing, power, running);
    player.teamID = "FA";
    return player;  
}
let createPlayer = (ratingCap, playerID, international) => {
    let country = "India";
    let name = indianFirstNames[randInt(0, indianFirstNames.length - 1)] + " " + indianLastNames[randInt(0, indianLastNames.length - 1)];
    let age = randInt(18, 44);
    let economy = randInt(0, ratingCap);
    let wicketTaking = randInt(0, ratingCap);
    let clutch = randInt(0, ratingCap);
    let accuracy = randInt(0, ratingCap);
    let battingIQ = randInt(0, ratingCap);
    let timing = randInt(0, ratingCap);
    let power = randInt(0, ratingCap);
    let running = randInt(0, ratingCap);
    let battingOverall = timing * 0.3 + power * 0.3 + battingIQ * 0.35 + running * 0.05;
    let bowlingOverall = wicketTaking * 0.4 + economy * 0.4 + accuracy * 0.1 + clutch * 0.1;
    let overall = 0;
    if ((battingOverall) > bowlingOverall) {
        overall = battingOverall + (100 - battingOverall) * Math.pow((bowlingOverall / 100), 4)
    } else {
        overall = bowlingOverall + (100 - bowlingOverall) * Math.pow((battingOverall / 100), 4)

    }

    if ((Math.random() > ((100-overall)/60))  && international) {
        country = determineCountry();
        name = internationalNames[randInt(0, internationalNames.length - 1)] + " " + internationalNames[randInt(0, internationalNames.length - 1)];
    }
    let player = new CricketPlayer(name, age, country, playerID, economy, wicketTaking, clutch, accuracy, battingIQ, timing, power, running);
    return player;

}
importPlayer = (importedPlayer, playerID) => {
    let country = importedPlayer.country;
    let age = importedPlayer.age;
    let name = importedPlayer.name;
    let economy = importedPlayer.economy;
    let wicketTaking = importedPlayer.wicketTaking;
    let clutch = importedPlayer.clutch;
    let accuracy = importedPlayer.accuracy;
    let battingIQ = importedPlayer.battingIQ;
    let timing = importedPlayer.timing;
    let power = importedPlayer.power;
    let running = importedPlayer.running;
    let player = new CricketPlayer(name, age, country, playerID, economy, wicketTaking, clutch, accuracy, battingIQ, timing, power, running);
    return player;
}

importPlayerWithTeam = (importedPlayer, playerID) => {
    let player = importPlayer(importedPlayer,playerID);
    player.teamID = parseInt(importedPlayer.teamID);
    player.calcValue();
    player.bid = parseFloat(importedPlayer.bid);
    if(player.bid>25){
        player.bid = 25;
    }
    return player;
}
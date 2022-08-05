localStorage.clear();
//used to reset auction
localStorage.userTeam = 0;
let teamNames = ["Hyderabad", "Dehli", "Bangalore", "Kolkata", "Rajasthan", "Chennai", "Mumbai", "Punjab", "Gujarat", "Lucknow"];
let teamColors1 = ["#f7a721", "#2561ae", "#EC1C24", "#2E0854", "#CBA92B", "#FFFF3C", "#004BA0", "#DCDDDF", "#8C411E", "#0056E5"];
let teamColors2 = ["#000000", "#EF1B23", "#2b2a29", "#b3a123", "#254aa5", "#0081E9", "#D1AB3E", "#ED1B24", "#F8EF22", "#AA2E53"];
let teams = [];
let resetStartScreen = (teamNames,teamColors1, teamColors2) => {
    teams = [];
    console.log(teamNames)
for (let i = 0; i < teamNames.length; i++) {
        teams.push(new Team(teamNames[i], teamColors1[i], teamColors2[i], i, ));
    }
localStorage.teams = JSON.stringify(teams)
let selectChoices = "<select name ='teamChosen' id='teamChosen' onchange='updateUserTeam()'>";
for (let i = 0; i < teams.length; i++) {
    selectChoices += `<option class="teamSelectionOption" value = ${teams[i].teamID} style="background-color:${teams[i].primaryColorHexcode}; color:${teams[i].secondaryColorHexcode}"> ${teams[i].teamName}</option>`;
}

selectChoices += "</select>";
document.getElementById("teamOptions").innerHTML = selectChoices;
localStorage.season =1;
}
resetStartScreen(teamNames,teamColors1, teamColors2, false);
let updateUserTeam = () => {
    localStorage.userTeam = parseInt(document.getElementById("teamChosen").value)
    let currentTeamSelected = teams[localStorage.userTeam]
      document.getElementById("teamChosen").style.backgroundColor = currentTeamSelected.primaryColorHexcode;
    document.getElementById("teamChosen").style.color = currentTeamSelected.secondaryColorHexcode;
}
localStorage.schedType = "ipl70";
let updateRosters = (year) =>{
    if(year == 22){
        if(document.getElementById("use21Rosters").checked){
            document.getElementById("use21Rosters").checked = false;
        }
    }else{
        if(document.getElementById("use22Rosters").checked){
            document.getElementById("use22Rosters").checked = false;
        }   
    }
    if(!document.getElementById("use21Rosters").checked){
        sessionStorage.rosters = "zilch";
        if(document.getElementById("use22Rosters").checked){
            sessionStorage.rosters = "2022";
        }
        localStorage.schedType = "ipl70";
        let teamNames = ["Hyderabad", "Dehli", "Bangalore", "Kolkata", "Rajasthan", "Chennai", "Mumbai", "Punjab", "Gujarat", "Lucknow"];
        let teamColors1 = ["#f7a721", "#2561ae", "#EC1C24", "#2E0854", "#CBA92B", "#FFFF3C", "#004BA0", "#DCDDDF", "#8C411E", "#0056E5"];
        let teamColors2 = ["#000000", "#EF1B23", "#2b2a29", "#b3a123", "#254aa5", "#0081E9", "#D1AB3E", "#ED1B24", "#F8EF22", "#AA2E53"];
        resetStartScreen(teamNames,teamColors1, teamColors2, false);
    }
    else{
        localStorage.schedType = "roundRobin";
        sessionStorage.rosters = "2021";
        let teamNames = ["Hyderabad", "Dehli", "Bangalore", "Kolkata", "Rajasthan", "Chennai", "Mumbai", "Punjab"];
let teamColors1 = ["#f7a721", "#2561ae", "#EC1C24", "#2E0854", "#CBA92B", "#FFFF3C", "#004BA0", "#DCDDDF"];
let teamColors2 = ["#000000", "#EF1B23", "#2b2a29", "#b3a123", "#254aa5", "#0081E9", "#D1AB3E", "#ED1B24"];
if(parseInt(localStorage.userTeam)>teamNames.length){
    localStorage.userTeam = 0;
}        
resetStartScreen(teamNames,teamColors1, teamColors2, true);
      
    }
}
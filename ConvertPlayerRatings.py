
import csv
import json
import os
with open('2022PlayerRatings.csv', 'r') as f:
    reader = csv.reader(f)
    players = list(reader)

playerList = []
playerNumber = 0
for n in players:
    if(playerNumber <1):
        playerNumber += 1
    else:
        dump = {
        "id":int(playerNumber),
        "name":players[playerNumber][0],
        "battingIQ":int(players[playerNumber][6]),
        "timing":int(players[playerNumber][7]),
        "power":int(players[playerNumber][8]),
        "running":int(players[playerNumber][9]),
        "economy":int(players[playerNumber][10]),
        "wicketTaking":int(players[playerNumber][11]),
        "accuracy":int(players[playerNumber][12]),
        "clutch":int(players[playerNumber][13]),
        "country":players[playerNumber][2],
        "age":int(players[playerNumber][1])
        }
        playerList.append(dump)
        playerNumber = playerNumber+1
print(json.dumps(playerList))
with open('cricketPlayerList2022.js', 'w') as outfile:
    json.dump(playerList, outfile)
# -*- coding: utf-8 -*-
"""
Created on Tue Feb  8 13:12:43 2022

@author: hgadd
"""

import urllib.request
def cricketStatGrabber (playerURL):
    data = {}
    fp = urllib.request.urlopen(playerURL)
    mybytes = fp.read()
    
    newstr = mybytes.decode("utf8")
    fp.close()
    mystr = newstr.split('"@type":"Person","name":"')
    data["name"] = mystr[1].split('"')[0]
    mystr = newstr.split('age is')

    data["age"] = int(mystr[1].split("y")[0])
    mystr = newstr.split(':"Country","name":"')
    data["country"] = mystr[1].split('"')[0]
    mystr = newstr.split('<tr class="bg-gray-100 fix-first-child-color"')
    statSet = []
    for n in range(len(mystr)):
        mystr[n] = mystr[n].split("</tr>")
    matchSet = []
    for n in range(len(mystr)):
        for y in mystr[n]:
            if ("tr" not in y and( "T20I" in y) ):
                y = y.split('<span class="out-padding">')
                for x in range(len(y)):
                    y[x] = y[x].split("</span>")
                    matchSet.append(y[x][0])
    for n in range(len(mystr)):
        for y in mystr[n]:
            if ("tr" not in y and( "T20" in y) and ("T20I" not in y) ):
                y = y.split('<span class="out-padding">')
                for x in range(len(y)):
                    y[x] = y[x].split("</span>")
                    statSet.append(y[x][0])
    mystr = newstr.split('<tr class="fix-second-child-color">')
    for n in range(len(mystr)):
        mystr[n] = mystr[n].split("</tr>")
    for n in range(len(mystr)):
            for y in mystr[n]:
                if ("tr" not in y and ("T20I" in y) ):
                    
                    y = y.split('<span class="out-padding">')
                    for x in range(len(y)):
                        y[x] = y[x].split("</span>")
                        matchSet.append(y[x][0])
    try:
        data["intMatches"] = int(matchSet[2])
    except:
        data["intMatches"] = 0
    
    for n in range(len(mystr)):
        for y in mystr[n]:
            if ("tr" not in y and( "T20" in y) and ("T20I" not in y) ):
                y = y.split('<span class="out-padding">')
                for x in range(len(y)):
                    y[x] = y[x].split("</span>")
                    statSet.append(y[x][0])

    done = False
    statSetOne = []
    statSetTwo = []
    i = 2
    while(not(done)):
        if("td" in statSet[i]):
            done = True
        else:
            statSetOne.append(statSet[i])
        i += 1
    done = False
    i += 1
    while(not(done)):
        statSetTwo.append(statSet[i])
        i += 1
        if(i >= len(statSet)):
            done = True

    battingStats = []
    bowlingStats = []
    batting = True
    for x in statSetOne:
        if "/" in x:
            batting = False
    if(batting):
        battingStats = statSetOne
        bowlingStats = statSetTwo
    else:
        battingStats = statSetTwo
        bowlingStats = statSetOne
    battingShift = 0
    data["matches"] = int(battingStats[0])
    if("-" in battingStats[1]):
        data["batInns"] = 0
        data["notOuts"] = 0
        data["runs"]= 0
        try:
            data["ballsFaced"] = 0
        except:
            battingShift += 1
            data["ballsFaced"] = 0
        data["foursScored"] = 0
        data["sixesScored"]= 0
        data["catches&stumpings"] = 0
    else:
        data["batInns"] = int(battingStats[1])
        data["notOuts"] = int(battingStats[2])
        data["runs"] = int(battingStats[3])
        try:
            data["ballsFaced"] = int(battingStats[battingShift+5])
        except:
            battingShift += 1
            data["ballsFaced"] = int(battingStats[battingShift+5])
        data["foursScored"] = int(battingStats[battingShift+9])
        data["sixesScored"] = int(battingStats[battingShift+10])
        data["catches&stumpings"] = int(battingStats[battingShift+11])+int(battingStats[battingShift+12])
    if("-" in bowlingStats[2]):
        data["bowlInns"] = 0
        data["ballsBowled"] = 0
        data["runsConceded"] = 0
        data["wickets"] = 0
    else:
        data["bowlInns"] = int(bowlingStats[1])
        data["ballsBowled"] = int(bowlingStats[2])
        data["runsConceded"] = int(bowlingStats[3])
        data["wickets"] = int(bowlingStats[4])
    return (data)
 
import csv
import json
import os
playerData = []
with open('CricketURLS.csv', 'r') as f:
    reader = csv.reader(f)
    players = list(reader)
    for n in players:
        try:
            playerData.append(cricketStatGrabber(n[0]))
        except:
            print(n[0])

    
# field names 
fields = ["name", "age","country", "intMatches","matches","batInns","notOuts","runs","ballsFaced","foursScored","sixesScored","catches&stumpings","bowlInns","ballsBowled","runsConceded","wickets"] 
    
# name of csv file 
filename = "playerRecords.csv"
    
# writing to csv file 
with open(filename, 'w') as csvfile: 
    # creating a csv dict writer object 
    writer = csv.DictWriter(csvfile, fieldnames = fields) 
        
    # writing headers (field names) 
    writer.writeheader() 
        
    # writing data rows 
    writer.writerows(playerData) 
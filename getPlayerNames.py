# -*- coding: utf-8 -*-
"""
Created on Fri Mar  4 14:00:31 2022

@author: hgadd
"""

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
    name = mystr[1].split('"')[0]

    return (name)
 
import csv
import json
import os
playerData = []
i = 0
dump = ""
with open('urlForNames.csv', 'r') as f:
    reader = csv.reader(f)
    players = list(reader)
    for n in players:
        i += 1
        print(i)
        try:
            temp = cricketStatGrabber(n[0])
            
        except:
            temp = "BLANKMAN"
        dump += temp
        dump += ", \n"

    
# field names 
fields = ["name", "age","country", "intMatches","matches","batInns","notOuts","runs","ballsFaced","foursScored","sixesScored","catches&stumpings","bowlInns","ballsBowled","runsConceded","wickets"] 
    
# name of csv file 
filename = "playerNamazs.csv"
    
# writing to csv file 
with open("playerNamazs.csv", 'w') as f:
    # creating a csv dict writer object 
       
    # writing headers (field names) 
        
    # writing data rows 

    f.write(dump)

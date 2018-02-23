import csv
import json
#3 en 6, dus 2 en 5
holidaydata = []
with open('holidaydata.csv', newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=';')
    for row in reader:
        holidaydata.append({'name': row[0], 'value': int(row[1])})

with open('holidaydata.json', 'w') as outfile:
    json.dump(holidaydata, outfile)
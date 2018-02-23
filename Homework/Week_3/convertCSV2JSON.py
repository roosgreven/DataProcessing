'''
Name: Roos Greven
11436700
Preparations week 3. Converter from CSV to JSON
'''

import csv
import json

# array to store data
holidaydata = []

# open the CSV file
with open('holidaydata.csv', newline='') as csvfile:

	# read CSV file
    reader = csv.reader(csvfile, delimiter=';')

    # loop over all lines in the file
    for row in reader:

    	# store data as dictionary in new array
        holidaydata.append({'name': row[0], 'value': int(row[1])})

# save data in new file
with open('holidaydata.json', 'w') as outfile:
	
	# save it as JSON
    json.dump(holidaydata, outfile)
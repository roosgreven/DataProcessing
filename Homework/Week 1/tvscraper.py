#!/usr/bin/env python
# Name: Roos Greven
# Student number: 11436700
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    
    # list to save all TV series
    completeList = []
    
    # loop over all divs containing TV series info
    allSeries = dom.find_all("div", "lister-item")
    for div in allSeries:
        
        # temporarily save info of one TV series
        templist = []
        
        # add title to temporary list
        title = div.find("h3").find("a").get_text()
        if not title:
            title = MISSING
        templist.append(title)
        
        # add rating to temporary list
        rating = div.find(class_= "ratings-imdb-rating").find("strong").get_text()
        if not rating:
            rating = MISSING
        templist.append(rating)
        
        # add genre(s) to temporary list
        genre = div.find(class_ = "genre").get_text().strip()
        if not genre:
            genre = MISSING
        templist.append(genre)
        
        # add actor(s)/actress(es) to temporary list
        actorlist = []
        actors = div.find_all("p")[2].find_all("a")
        for actor in actors:
            actorlist.append(actor.get_text())
        actors = ", ".join(actorlist)
        if not actors:
            actors = MISSING
        templist.append(actors)
        
        # add runtime to temporary list
        runtime = int(div.find(class_ = "runtime").get_text().split()[0])
        if not runtime:
            runtime = MISSING
        templist.append(runtime)
        
        # add temporary list to total list of TV series
        completeList.append(templist)
    print(completeList)
        
    return completeList


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write TV series to disk
    for row in tvseries:
        writer.writerow(row)

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)

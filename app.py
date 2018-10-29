import os

import pandas as pd
import numpy as np

import csv
import json
from flask_pymongo import PyMongo
from pymongo import MongoClient


from flask import Flask, jsonify, render_template

app = Flask(__name__)

#**************************************
#          Set Up Databases
#**************************************
app.config["MONGO_DBNAME"] = "stl"
app.config["MONGO_URI"] = "mongodb://localhost:27017/stl"
mongo = PyMongo(app)


results_csv = 'db/results.csv'
stlctycombined_csv = 'db/stlctycombined.csv'
 
results_data = []
stlctycombined_data = []
 
with open(results_csv, "r") as f:
    reader = csv.DictReader(f)

    # Iterate through each zip...
    for row in reader:
        temp = {}
        # Iterate through each field of target zip
        for field, val in row.items():
            temp[field] = val
        # Append zip to our data list
        results_data.append(temp)

with open(stlctycombined_csv, "r") as f:
    reader = csv.DictReader(f)

    # Iterate through each zip...
    for row in reader:
        temp = {}
        # Iterate through each field of target zip
        for field, val in row.items():
            temp[field] = val
        # Append zip to our data list
        stlctycombined_data.append(temp)


client = MongoClient('localhost', 27017)
db = client['stl']
collection1 = db['stlresults']
collection1.insert(results_data)

collection2 = db['stlctycombined']
collection2.insert(stlctycombined_data)

# with open('stlresults.json', 'w') as outfile:
#     json.dump(results_data, outfile)

 
# with open('stlresults.json') as f:
#      data = json.loads(f.read())
#      db.stlresults.insert(data)


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("LandingPage.html")

@app.route("/PersonalLandingPage.html")
def personalLandingPage():
    """Return a list of sample names."""

    return render_template("PersonalLandingPage.html")

@app.route("/personal_zips.html")
def personal_zips():
    """Return a list of sample names."""

    return render_template("personal_zips.html")

@app.route("/personal_criteria.html")
def personal_criteria():

    return render_template("personal_criteria.html")

@app.route("/zip_data/<zip>")
def zip_data(zip):
    this_zip = mongo.db.stlresults.find_one({'Zip' : zip})

    output = []
    
    output.append({'zip' : this_zip['Zip'], 'realRating' : this_zip['RelRating'], 
    'busRating' : this_zip['BusRating'], 'edRating' : this_zip['EdRating'],
    'crimeRating': this_zip['CrimeRating'], 'popRating' : this_zip['PopRating'],
    'incomeRating': this_zip['IncomeRating']})
    return jsonify({'result' : output})


@app.route("/zip_map_data/<zip>")
def zip_map_data(zip):
    cur_zip = mongo.db.stlctycombined.find({'Zip' : zip})

    output = []
    
    for doc in cur_zip:
        output.append({'zip' : doc['Zip'], 'type' : doc['Type'], 
            'name' : doc['Name/Price'], 'address' : doc['Address'], 
            'category': doc['Category'], 'lat' : doc['Latitude'],
            'lng': doc['Longitude'], 'date' : doc['Date']})
        
    return jsonify({'result' : output})

   

if __name__ == "__main__":
    app.run(debug=True)
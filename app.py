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
 
results_data = []
 
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



client = MongoClient('localhost', 27017)
db = client['stl']
collection = db['stlresults']

collection.insert(results_data)

# with open('stlresults.json', 'w') as outfile:
#     json.dump(results_data, outfile)

 
# with open('stlresults.json') as f:
#      data = json.loads(f.read())
#      db.stlresults.insert(data)


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("LandingPage.html")

@app.route("/personal.html")
def personal():
    """Return a list of sample names."""

    return render_template("personal.html")

@app.route("/personal_zips.html")
def personal_zips():
    """Return a list of sample names."""

    return render_template("personal_zips.html")

@app.route("/zip_data/<zip>")
def zip_data(zip):
    """Return a list of sample names."""
    this_zip = mongo.db.stlresults.find_one({'Zip' : zip})

    output = []
    
    output.append({'zip' : this_zip['Zip'], 'busScore' : this_zip['Score'], 'busRating' : this_zip['Rating']})
    return jsonify({'result' : output})

if __name__ == "__main__":
    app.run(debug=True)
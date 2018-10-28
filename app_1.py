import os

import pandas as pd
import numpy as np

from flask import Flask, render_template, redirect, jsonify, render_template
from flask_pymongo import PyMongo
from PyMongo import MongoClient


app = Flask(__name__)


#################################################
# Database Setup
#################################################


# df_results = pd.read_csv('db/results.csv')
# df_cty_data = pd.read_csv('db/stlctycombined.csv')
client = MongoClient()
db = client.stlDatabase.results
# results = db.results
# df = pd.read_csv("db/results.csv")
# records_=df.to_dict(orient='records')
# db.results.insert_many(records_)
for i, row in enumerate(csv_f):
               if i > 5 and len(row) > 1 :
                 print(row)
                 db.insert({'F1': row[0], 'F2': row[1]})


app.config['MONGO_DBNAME']='stlDatabase'
app.config['MONGO_URI']="mongodb://localhost27017/stlDatabase"
mongo=PyMongo(app)


for i, row in enumerate(csv_f):
               if i > 5 and len(row) > 1 :
                 print(row)
                 db.insert({'F1': row[0], 'F2': row[1]})


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/zips")
def zips():
    """Return a list of sample names."""

    mng_client = PyMongo.MongoClient('localhost', 5000)
    mng_db = mng_client['stlCty']  #Replace mongo db name
    collection_name = 'results'  # Replace mongo db collection name
    db_cm = mng_db[collection_name]
    cdir = os.path.dirname('db/results.csv')
    file_res = os.path.join(cdir, filepath)

    data = pd.read_csv(file_res)
    data_json = json.loads(data.to_json(orient='records'))
    db_cm.remove()
    db_cm.insert(data_json)
    return db_cm




if __name__ == "__main__":
    app.run(debug=True)
import json
from pprint import pprint
import csv

counts = {"Hyperbole": 0, "Meosis": 0}
headline_pairs = []

with open('dataset/mongo_data_snapshot.json', 'r') as datafile:
    data = json.load(datafile)
    
    # extracting records
    for record in data:
        # print(record)

        for anno in record["annotations"]:
            counts[anno["distortion_category"]] += 1

            if(anno["distortion_category"] == "Hyperbole"):
                headline_pairs.append((record["og_headline"], anno["dist_headline"]))
            elif(anno["distortion_category"] == "Meosis"):
                headline_pairs.append((anno["dist_headline"], record["og_headline"]))

    pprint(counts)
    # pprint(headline_pairs[:10])


with open('dataset/headline_pairs.tsv', 'w') as csvfile:
    # creating a csv reader object
    csvwriter = csv.writer(csvfile, delimiter="\t")
    
    for pair in headline_pairs:
        csvwriter.writerow(pair)
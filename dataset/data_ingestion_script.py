from pymongo import MongoClient
import csv
import pprint

# Mongo DB Config
client = MongoClient('localhost', 27017)
db = client['InfoDistortion_DB']
headlines = db.headlineCollection
   
# pprint.pprint(headlines.find_one())
def pushAnnotations(annoRow):
    # print(annoRow)
    
    hline = headlines.find_one({"srno": int(annoRow[0])})
    # pprint.pprint(hline)
    
    count = len(hline['annotations'])
    print("Adding new annotations to srno:", annoRow[0], " | Count: (", count, ") -> ( ", end='')

    annoType = ('Hyperbole', 'Meosis')

    for idx, anno in enumerate(annoRow[1:]):
        if(anno):
            newAnno = {
                'idx': count,
                'userid': 'kiera.gross',
                'edit_state': 'Draft',
                'distortion_category': annoType[idx],
                'dist_headline': anno
            }

            headUpdated = headlines.find_one_and_update({'srno': int(annoRow[0])}, {'$push': {'annotations': newAnno}})
            # pprint.pprint(headUpdated)
            count += 1
    
    print(count, ")")

with open('kiera_annotations.tsv', 'r') as csvfile:
    # creating a csv reader object
    csvreader = csv.reader(csvfile, delimiter="\t")
 
    # extracting each data row one by one
    for row in csvreader:
        # print(row)
        pushAnnotations(row)
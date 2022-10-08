import json

def get_headlines(count, start_idx=0):
    headlines = []
    with open('dataset/mongo_data_snapshot.json', 'r') as datafile:
        data = json.load(datafile)

        # extracting records
        for record in data[start_idx:start_idx+count]:
            # print(record)
            headlines.append(record["og_headline"])

    return headlines

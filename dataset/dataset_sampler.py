import json
from pprint import pprint
import csv
import random
from parrot import Parrot

parrot = Parrot(model_tag="prithivida/parrot_paraphraser_on_T5", use_gpu=False)

headline_pairs = []
with open('dataset/headline_pairs.tsv', 'r') as csvfile:
    csvreader = csv.reader(csvfile, delimiter="\t")
    headline_pairs = list(csvreader)

with open('dataset/neg_headline_pairs.tsv', 'w') as neg_file:
    with open('dataset/pos_headline_pairs.tsv', 'w') as pos_file:
        
        # creating csv writer objects for dataset samples
        neg_csvwriter = csv.writer(neg_file, delimiter="\t")
        pos_csvwriter = csv.writer(pos_file, delimiter="\t")

        for row in headline_pairs:
            # print(row)

            pos_csvwriter.writerow([row[0], row[1], 1])

            if random.random() <= 0.5:
                neg_csvwriter.writerow([row[0], random.choice(headline_pairs)[0], 0])
            else:
                para_phrases = parrot.augment(input_phrase=row[0])
                if para_phrases:
                    neg_csvwriter.writerow([row[0], random.choice(para_phrases)[0], 0])
                # pass

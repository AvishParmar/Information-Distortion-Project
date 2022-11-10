import torch
import csv
import pprint
import pandas as pd
import numpy as np
import torch.nn as nn
from torch.utils.data import DataLoader
from transformers.modeling_outputs import TokenClassifierOutput
from transformers import DataCollatorWithPadding, AutoModelForSequenceClassification, Trainer, TrainingArguments, AutoTokenizer, AutoModel, AutoConfig

from transformers import BertTokenizer, BertModel, BertForSequenceClassification
from datasets import load_metric
from tqdm.auto import tqdm
import os
import random


def load_dataset(filename):

    headline_pairs = []
    with open(filename, 'r') as csvfile:
        csvreader = csv.reader(csvfile, delimiter="\t")
        headline_tuples = list(csvreader)
    # for i in headline_tuples:
    #     headline_pairs.append(((i[0], i[1]), i[2]))

    return headline_tuples


def tokenize(batch):
    return tokenizer(batch, truncation=True, max_length=100)


class BERT():

    def __init__(self, model_name="bert-base-uncased") -> None:
        #self.model = BertModel.from_pretrained(model_name)
        self.model = BertForSequenceClassification.from_pretrained(
            model_name, num_labels=1)

        self.tokenizer = BertTokenizer.from_pretrained(model_name)
        self.dropout = nn.Dropout(0.5)
        self.linear = nn.Linear(768, 1)

    def get_tokenizer_and_model(self):
        return self.model, self.tokenizer

    # def tokenize_data(self, data):
    #     return self.tokenizer.tokenize(data)

    def forward(self, input_ids, attn_mask, labels=None):
        outputs = self.model(input_ids, attention_mask=attn_mask)
        sequence_outputs = self.dropout(outputs[0])
        logits = self.linear(sequence_outputs[:, 0, :].view(-1, 768)).logits
        loss = None
        if labels is not None:
            loss_fct = nn.CrossEntropyLoss()
            loss = loss_fct(logits.view(-1, 1), labels)

            return TokenClassifierOutput(loss=loss, logits=logits, hidden_states=outputs.hidden_states, attentions=outputs.attentions)
         # extract the 1st token's embeddings


if __name__ == "__main__":

    bert = BERT()
    model, tokenizer = bert.get_tokenizer_and_model()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    headline_pairs_pos = load_dataset('dataset/pos_headline_pairs.tsv')
    headline_pairs_neg = load_dataset('dataset/neg_headline_pairs.tsv')
    train_size = int(0.8 * len(headline_pairs_pos))
    test_size = len(headline_pairs_pos) - train_size

    train_dataset_pos, test_dataset_pos = torch.utils.data.random_split(
        headline_pairs_pos, [train_size, test_size])

    train_size = int(0.8 * len(headline_pairs_neg))
    test_size = len(headline_pairs_neg) - train_size

    train_dataset_neg, test_dataset_neg = torch.utils.data.random_split(
        headline_pairs_neg, [train_size, test_size])

    train_dataset = list(train_dataset_neg) + list(train_dataset_pos)
    test_dataset = test_dataset_neg + test_dataset_pos

    random.shuffle(train_dataset)
    # train_dataloader = DataLoader(train_dataset, shuffle=True)

    # train_dataset = load_dataset('')
    # validation_dataset = load_dataset('')
    # test_dataset = load_dataset('')

    # encoding_train = bert.tokenize_data(train_dataset)
    # encoding_test = bert.tokenize_data(test_dataset)
    # encoding_validation = bert.tokenize_data(validation_dataset)

    epochs = 5
    progress_bar_train = tqdm(range(epochs * len(train_dataset)))
    progress_bar_test = tqdm(range(epochs * len(test_dataset)))

    eval_metric = load_metric("accuracy")

    optimizer = torch.optim.Adam(
        filter(lambda p: p.requires_grad, model.parameters()))

    model.train()
    # pprint.pprint(next(iter(train_dataloader)))
    for epoch in range(epochs):
        for batch in train_dataset:  # If you have a DataLoader()  object to get the data.

            # data = [batch[0], batch[1]]
            # print(data)
            # print()
            # assuming that data loader returns a tuple of data and its targets
            targets = torch.from_numpy(np.array(np.float32(batch[2])))
            # print(targets)
            # print()
            optimizer.zero_grad()

            #encoding = bert.tokenizer.batch_encode_plus(data, return_tensors='pt', padding=True, truncation=True,max_length=50, add_special_tokens = True)
            encoding = bert.tokenizer(batch[0], batch[1], return_tensors='pt', padding="max_length",
                                      truncation=True, max_length=50, add_special_tokens=True)

            input_ids = encoding['input_ids']
            attention_mask = encoding['attention_mask']
            outputs = model(
                input_ids, attention_mask=attention_mask, labels=targets)
            # outputs = torch.nn.functional.log_softmax(outputs, dim=1)

            loss = outputs.loss
            loss.backward()
            optimizer.step()
            progress_bar_train.update(1)

        model.eval()

        for batch in test_dataset:
            encoding = bert.tokenizer(batch[0], batch[1], return_tensors='pt', padding="max_length",
                                      truncation=True, max_length=50, add_special_tokens=True)
            input_ids = encoding['input_ids']
            attention_mask = encoding['attention_mask']

            with torch.no_grad():
                outputs = model(
                    input_ids, attention_mask=attention_mask, labels=targets)

            logits = outputs.logits
            predictions = torch.argmax(logits, dim=-1)
            eval_metric.add(predictions=predictions, references=batch[2])
            progress_bar_test.update(1)

        print(eval_metric.compute())

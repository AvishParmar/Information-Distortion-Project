from random import sample
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_mongoengine import MongoEngine
import json

app = Flask(__name__)
CORS(app)

# Mongo DB Config
app.config['MONGODB_SETTINGS'] = {
    'db': 'InfoDistortion_DB',
    'host': 'localhost',
    'port': 27017
}

db = MongoEngine()
db.init_app(app)


class AnnotationsDOM(db.EmbeddedDocument):
    idx = db.IntField()
    userid = db.StringField()
    edit_state = db.StringField()
    distortion_category = db.StringField()
    dist_headline = db.StringField()

    # def to_json(self):
    #     return {
    #         "userid": self.userid,
    #         "edit_state": self.edit_state,
    #         "distortion_category": self.distortion_category,
    #         "dist_headline": self.dist_headline
    #     }


class HeadlineDOM(db.Document):
    meta = {'collection': 'headlineCollection'}
    srno = db.IntField()
    og_headline = db.StringField()
    annotations = db.ListField(db.EmbeddedDocumentField(AnnotationsDOM))

    # def to_json(self):
    #     return {
    #         "srno": self.srno,
    #         "og_headline": self.og_headline,
    #         "annotations": self.annotations.to_json()
    #     }


@app.route("/headline", methods=['GET'])
def get_headline_data():
    print(request.args)

    srno = json.loads(request.args.get('srno'))
    headline = HeadlineDOM.objects(srno=srno).get()

    if not headline:
        abort(500, description="[Error] data not found")
    else:
        return jsonify(headline.to_json())


@app.route("/annotate", methods=['GET'])
def get_annnotate_data():
    srno = json.loads(request.args.get('srno'))
    headline = HeadlineDOM.objects(
        srno__gt=srno, annotations__size=0).exclude("id").first()
    # print(headline.to_json())
    if not headline:
        headline = HeadlineDOM.objects(srno__gt=srno).exclude("id").first()
        if not headline:
            abort(500, description="[Error] data not found")

    return jsonify(headline.to_json())


@app.route("/validate", methods=['GET'])
def get_validate_data():
    srno = json.loads(request.args.get('srno'))
    headline = HeadlineDOM.objects(
        srno__gt=srno, annotations__not__size=0).exclude("id").first()
    # print(headline.to_json())

    if not headline:
        headline = HeadlineDOM.objects(srno__gt=srno).exclude("id").first()
        if not headline:
            abort(500, description="[Error] data not found")

    return jsonify(headline.to_json())


@app.route("/annotate", methods=['PUT'])
def add_annnotate_data():
    record = json.loads(request.data)
    print(record)

    headline = HeadlineDOM.objects(srno=record['srno']).get()
    annotation = AnnotationsDOM(
        idx=len(headline.annotations),
        userid=record['userid'],
        edit_state=record['edit_state'],
        distortion_category=record['distortion_category'],
        dist_headline=record['dist_text']
    )

    headline.annotations.append(annotation)
    headline.save()
    headline.reload()

    return jsonify(headline.to_json())


@app.route("/annotate", methods=['POST'])
def edit_annnotate_data():
    record = json.loads(request.data)
    print(record)

    headline = HeadlineDOM.objects(srno=record['srno']).get()

    headline.annotations[record['idx']].dist_headline = record['dist_text']
    headline.annotations[record['idx']].edit_state = record['edit_state']
    headline.save()
    headline.reload()

    return jsonify(headline.to_json())


@app.route("/validate", methods=['POST'])
def set_validate_data():
    record = json.loads(request.data)
    print(record)

    headline = HeadlineDOM.objects(srno=record['srno']).get()
    headline.annotations[record['idx']].edit_state = record['edit_state']
    headline.save()
    headline.reload()

    return jsonify(headline.to_json())


@app.errorhandler(500)
def data_not_found(e):
    return jsonify(error=str(e)), 500


if __name__ == '__main__':
    app.run(debug=True)

sample_data = {
    'srno': 1,
    'og_headline': 'This is a sample headline in Mongo',
    'annotations': [
        {
            'idx': 0,
            'userid': 'jerin.john',
            'edit_state': 'Draft',
            'distortion_category': 'Meosis',
            'dist_headline': 'This is the distorted random meosis version from Mongo'
        },
        {
            'idx': 1,
            'userid': 'jerin.john',
            'edit_state': 'Draft',
            'distortion_category': 'Generalization',
            'dist_headline': 'This is the second distorted version from Mongo'
        },
        {
            'idx': 2,
            'userid': 'jerin.john',
            'edit_state': 'Draft',
            'distortion_category': 'Meosis',
            'dist_headline': 'This is the third distorted version from Mongo'
        }
    ]
}

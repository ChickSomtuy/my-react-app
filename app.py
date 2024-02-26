from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from bson import ObjectId
from bson import json_util
import json

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Connect to MongoDB
client = MongoClient('mongodb+srv://Somtuy:PpP93ztmCtFyBTAQ@somtuy.wm8gzkz.mongodb.net/?retryWrites=true&w=majority&appName=Somtuy')
db = client['suteechao']
collection = db['notebookshop']

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/products", methods=["GET"])
@cross_origin()
def get_all_products():
    try:
        products = list(collection.find())
        product_json =json.loads(json_util.dumps(products))
        return jsonify(product_json), 200
    except Exception as e:
        return jsonify({"error": str(e)}),500


@app.route("/products", methods=["POST"])
@cross_origin()
def add_product():
    data = request.json
    new_product = {
        "_id" : collection.count_documents({}),
        "name": data["name"],
        "price": data["price"],
        "img": data["img"]
    }
    result = collection.insert_one(new_product)
    new_product["_id"] = str(result.inserted_id)
    return jsonify(new_product), 201

@app.route("/products/<int:product_id>", methods=["DELETE"])
@cross_origin()
def delete_product(product_id):
    result = collection.delete_one({"_id": int(product_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Product deleted"}), 200
    else:
        return jsonify({"message": "Product not found"}), 404

@app.route("/products/<int:product_id>", methods=["PUT"])
@cross_origin()
def update_product(product_id):
    data = request.json
    result = collection.update_one({"_id": (product_id)}, {"$set": data})
    if result.modified_count == 1:
        return jsonify({"message": "Product updated"}), 200
    else:
        return jsonify({"message": "Product not found"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

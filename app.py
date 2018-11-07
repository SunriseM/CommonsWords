from flask import Flask, jsonify, request
from words import words_count
app = Flask(__name__)

@app.route("/")
def hello():
  return "Hello World!"

@app.route("/api/1/get_words", methods=['GET'])
def get_words():
  string = request.args.get('string')
  return jsonify({'words': words_count(string)})
	
if __name__ == "__main__":
	app.run()
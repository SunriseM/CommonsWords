from flask import Flask, jsonify, request, render_template
from words import words_count
from data import get_content, get_random_wiki
app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('index.html')

@app.route("/api/1/get_words", methods=['GET'])
def get_words():
    url = request.args.get('url')
    string = get_content(url)

    return jsonify({'words': words_count(string)})

@app.route("/api/1/rndwiki", methods=['GET'])
def get_wiki():
    data = get_random_wiki()
    return jsonify({'words': words_count(data['words']), 'title': data['title']})
	
if __name__ == "__main__":
	app.run()
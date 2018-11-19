from bs4 import BeautifulSoup
import requests
import urllib
import markdown

RANDOM_WIKI = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&prop=revisions&rvprop=content&grnlimit=1"

def get_html(url: str):
    if not url.startswith('http'):
        url = 'http://' + url

    return requests.get(url)

def parse_html(html: str, body: bool):
    soup = BeautifulSoup(html)

    if body:
        soup = soup.body

    tags = soup.findAll(['script', 'style'])
    for match in tags:
        match.decompose()

    return ''.join(soup.get_text())

def get_content(url: str):
    page = get_html(url).text
    return parse_html(page, body=True)

def get_random_wiki():
    json = get_html(RANDOM_WIKI).json()

    article_id = list(json['query']['pages'].keys())[0]
    article = json['query']['pages'][article_id]

    markdown_text = article['revisions'][0]['*']
    html = markdown.markdown(markdown_text)
    return {'words': parse_html(html, body=False), 'title': article['title']}


  
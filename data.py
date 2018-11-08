from bs4 import BeautifulSoup
import requests
import urllib

def get_content(url: str):
  if not url.startswith('http'):
    url = 'http://' + url
  page = requests.get(url).text
  soup = BeautifulSoup(page, 'html.parser')
  return ''.join(soup.findAll(text=True))
  
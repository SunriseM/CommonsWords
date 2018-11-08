from bs4 import BeautifulSoup
import requests
import urllib

def get_content(url: str):
  if not url.startswith('http'):
    url = 'http://' + url
  page = requests.get(url).text
  soup = BeautifulSoup(page)

  soup = soup.body

  tags = soup.findAll(['script', 'style'])
  for match in tags:
      match.decompose()


  return ''.join(soup.get_text())
  
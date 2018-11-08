import re

def words_count(string: str) -> dict:
  words_count = dict()

  ## words = string.split()

  words = re.split('[\W_]', string)

  for word in words:
    if word not in words_count:
      words_count[word] = 0
    
    words_count[word] += 1
  
  return words_count
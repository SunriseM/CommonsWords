import re

def words_count(string: str) -> dict:
  words_dict = dict()
  words_list = list()

  ## words = string.split()

  words = re.split('[\W_]', string)

  for word in words:
    if word not in words_dict:
      words_dict[word] = 0
    
    words_dict[word] += 1

  del words_dict[""]

  texts = list(words_dict.keys())
  frequency = list(words_dict.values())

  for index, text in enumerate(texts):
    words_list.append({'text': text, 'size': frequency[index]})
  
  return words_list
import os
import re
from unidecode import unidecode

def valid_word(text):
    return bool(re.search('[a-zA-ZŠĐČĆŽšđčćž]', text))

def main():
	for file in os.listdir("."):
		if file.endswith("_full.txt"):
			new_file_name = file[:file.index("_")] + "_cleaned.txt"
			lines = []
			with open(file, encoding="utf-8") as f:
				for line in f.readlines():
					# text = unidecode(line.split(" ")[0]) # remove accents and stuff that is not possible to type
					text = line.split(" ")[0]
					if valid_word(text): 
						lines.append(text+"\n")
			with open(new_file_name, "w") as f:
				f.writelines(lines)
	

if __name__ == "__main__":
	main()
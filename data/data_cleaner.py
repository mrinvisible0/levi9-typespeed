import os
import re

def has_cyrillic(text):
    return bool(re.search('[\u0400-\u04FF]', text))

def main():
	for file in os.listdir("."):
		if file.endswith("_full.txt"):
			new_file_name = file[:file.index("_")] + "_cleaned.txt"
			lines = []
			with open(file) as f:
				for line in f.readlines():
					text = line.split(" ")[0]
					if not has_cyrillic(text): # no cyrilics :(
						lines.append(text+"\n")
			with open(new_file_name, "w") as f:
				f.writelines(lines)
	

if __name__ == "__main__":
	main()
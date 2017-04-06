import csv
import requests
import json
import time

API_KEY = "&key=AIzaSyCoEMAhhOW9ypAi70OGHdFUtqsr9ZO-1YI"
BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address="

locations = []

def setupFile():
	with open('clean.csv', newline='', encoding='utf8') as data:
		reader = csv.reader(data, delimiter=',')
		for row in reader:
			locations.append(row)


def plusInAddress(address):
	return address.replace(" ", "+")


def request_URL(address):
	return BASE_URL + plusInAddress(address + " San Francisco") + API_KEY


def main():
	setupFile()
	with open('lat_longs.txt', 'w') as outfile:
		for x in locations:
			address = x[2]
			url = request_URL(address)
			response = requests.get(url)
			dataAPI = response.json()
			if dataAPI['results']:
				sf = False
				# for item in dataAPI['results'][0]['address_components']:
				# 	if 'SF' in item.values():
				# 		print("Found SF!")

				# 	print(type(item))
				# 	print(item)
				data = dataAPI['results'][0]['geometry']['location']
				json.dump(data, outfile)
				outfile.write('\n')

			print(address)
			time.sleep(.1)

	# for row in locations:


if __name__ == '__main__':
	main()

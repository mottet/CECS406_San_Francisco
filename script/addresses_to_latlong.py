import csv
import requests
import json
import time

API_KEY = "&key=" + "AIzaSyC9_Ygf9lPeB7gTTpSDZVzcJaHugxaQD6A"
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
	with open('lat_longs.csv', 'w', newline='') as csvfile:
		writer = csv.writer(csvfile, delimiter=',')
		for x in locations:
			address = x[2]
			url = request_URL(address)
			response = requests.get(url)
			dataAPI = response.json()
			if dataAPI['results']:
				data = dataAPI['results'][0]['geometry']['location']
				lat = data['lat']
				lng = data['lng']
				writer.writerow(x + [lat] + [lng])

			print(address)
			time.sleep(.05)

	# for row in locations:


if __name__ == '__main__':
	main()

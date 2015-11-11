### BEGIN LICENSE
# The MIT License (MIT)
#
# Copyright (C) 2015 Christopher Wells <cwellsny@nycap.rr.com>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
### END LICENSE
"""A script which gets weather data from OpenWeatherMap and starts a server to
 serve a webpage to display the data."""
from __future__ import print_function
from subprocess import Popen, PIPE
import time
import json
import sys

# Function to print that there is an invalid config setting and end the program
def invalid_setting(setting):
	"""Send error message for invalid setting to terminal's stderr"""
	if setting in CONFIG:
		print("Invalid setting '" + setting + "': ", CONFIG[setting], file=sys.stderr)
	else:
		print("Required setting '" + setting + "'", "is not set.", file=sys.stderr)
	sys.exit()

# Read in the configuration settings
CONFIG = json.loads(open("config.json").read())
CITY = None
if 'city' in CONFIG:
	CITY = CONFIG['city']
APIKEY = None
if 'apikey' in CONFIG:
	APIKEY = CONFIG['apikey']
TIMEDIFFERENCE = 0
if 'time-difference' in CONFIG:
	 TIMEDIFFERENCE = CONFIG['time-difference']
PORT = 8001
if 'port' in CONFIG:
	PORT = CONFIG['port']
TEMPUNIT = "F"
if 'temp-unit' in CONFIG:
	TEMPUNIT = CONFIG['temp-unit']

# Check to make sure that all configuration settings are valid
if CITY == None or CITY < 0:
	invalid_setting("city")
if APIKEY == None:
	invalid_setting("apikey")
if TIMEDIFFERENCE < -12 or TIMEDIFFERENCE > 14:
	invalid_setting("time-difference")
if PORT < 0:
	invalid_setting("port")
if TEMPUNIT != "F" and TEMPUNIT != "C" and TEMPUNIT != "K":
	invalid_setting("temp-unit")

# Start the server
Popen("python3 -m http.server " + str(PORT), shell=True, stdin=PIPE, stdout=PIPE)

# Get the weather data every x minutes
UPDATE_INTERVAL = 60
i = 0
while 1 == 1:
	# Get weather data
	Popen("curl -H 'x-api-key:" + APIKEY + "' http://api.openweathermap.org/" + \
		"data/2.5/forecast?id=" + str(CITY) + " > forcast.json", shell=True, \
		stdin=PIPE, stdout=PIPE)

	# Wait x minutes until getting next weather data
	time.sleep(UPDATE_INTERVAL * 60)

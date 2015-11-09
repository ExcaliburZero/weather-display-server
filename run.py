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

# Read in the configuration settings
CONFIG = json.loads(open("config.json").read())
CITY = CONFIG['city']
APIKEY = CONFIG['apikey']

# Start the server
Popen("python3 -m http.server 8001", shell=True, stdin=PIPE, stdout=PIPE)

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

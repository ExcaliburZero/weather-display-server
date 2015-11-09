# weather-display-server
Weather Display Server is a python application which gathers weather data and displays it on a webpage.

## Usage
Weather Display Server can be run by creating a configuration file and then running the following command:

```
python run.py
```

After running this command, the webpage can be accessed by visiting `localhost:8001` in your internet browser.

## Configuration
Weather Display Server can be configured by creating a `config.json` file in the root directory of the project. An example of a configuration file is as follows:

```json
{                                                                               
         "city": 1234,                                                        
         "apikey": "th1s1sn0nsense",                           
         "time-difference": -5                                                   
}
```

### Setting Descriptions
* `city` - The id of the city that the weather forcasts will be for. See the folowing page for a list of all of Open Weather Map's city ids: http://openweathermap.org/help/city_list.txt
* `apikey` - The apikey that is registered with your Open Weather Map account.
* `time-difference` - The difference in time in hours for the desired timezone from UTC time.

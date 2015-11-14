# weather-display-server
Weather Display Server is a python application which gathers weather data and displays it on a webpage.

## Usage
Weather Display Server can be run by creating a configuration file and then running the following command. After running this command, the webpage can be accessed by visiting `localhost:8001` in your internet browser.

```
python run.py
```

In order to keep Weather Display Server running in the background even after you log out, you can use the following command. The process can be ended by killing it using a system monitor program like `top`.

```
nohup python run.py &
```

## Configuration
Weather Display Server can be configured by creating a `config.json` file in the root directory of the project. An example of a configuration file is as follows:

```json
{                                                                               
         "city": 1234,                                                        
         "apikey": "th1s1sn0nsense",                           
         "time-difference": -5                                                   
}
```

### Settings
#### Required
| Setting | Description |
|---------|-------------|
| `city` | The id of the city that the weather forcasts will be for, entered as a number. See the folowing page for a list of all of Open Weather Map's city ids: http://openweathermap.org/help/city_list.txt |
| `apikey` | The apikey that is registered with your Open Weather Map account, entered as a string. |
#### Optional
| Setting | Description |
|---------|-------------|
| `time-difference` | The difference in time in hours for the desired timezone from UTC time, entered as an integer. Defaults to `0`. |
| `port` | The port that the webpage will be served on, entered as a number. Defaults to `8001`. |
| `header-units` | Whether the measureument units should be displayed in the header or in the table. Valid values are `"Y"` for having the units in the header and `"N"` for having the units in the table. Defaults to `"Y"`. |
| `ditto-marks` | The string that is displayed in place of repeated measurements. This can be set to any string or character. Defaults to `"''"`. |
| `temp-unit` | The units that are used for displaying temperature. Valid values are `"F"` for Farenheit. `"C"` for Celcius, and `"K"` for Kelvin. Defaults to `"F"`. |
| `precipitation-unit` | The units that are used for displaying precipitation. Valid values are `"in"` for inches and `"mm"` for milimeters. Defaults to `"mm"`. |
| `wind-speed-unit` | The units that are used for displaying wind speed. Valid values are `"mph"` for miles per hour, `"m/s"` for meters per second, and `"km/h"`for kilometers per hour. Defaults to `"m/s"`. |

## License
The source code of Weather Display Server is availible under [The MIT License](http://opensource.org/licenses/MIT), see the `LICENSE` file for more information.

Any images or other media included with Weather Display Sever are availible under the [CC BY-SA 4.0 license](https://creativecommons.org/licenses/by-sa/4.0/), see the `LICENSE` file for more information.

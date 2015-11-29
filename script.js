// Setup several global variables
var config_settings;
var time_difference;
var ditto_marks;
var header_units;
var precipitation_unit;
var precipitation_ending;
var temp_unit;
var temp_ending;
var cloud_cover_ending;
var wind_speed_unit;
var wind_speed_ending;

// Convert Kelvin to Farenheit
function k_to_f(kelvin) {
  return (kelvin - 273.15) * 1.80 + 32.0;
}

// Convert Kelvin to Celcius
function k_to_c(kelvin) {
  return kelvin - 273.15;
}

// Get the temperature unit ending for the given setting
function get_temp_ending() {
  switch (temp_unit) {
    case "F":
      return "&deg;F";
    case "C":
      return "&deg;C";
    case "K":
      return "K";
  }
}

// Convert the given Kelvin temperature to the correct unit based on the temp-unit config setting
function convert_temp(kelvin) {
  var converted_temp;
  if (temp_unit === "F") {
    converted_temp = k_to_f(kelvin);
  }
  else if (temp_unit === "C") {
    converted_temp = k_to_c(kelvin);
  }
  else if (temp_unit === "K") {
    converted_temp = kelvin;
  }

  if (header_units === "N") {
    temp_ending = " " + get_temp_ending();
  } else {
    temp_ending = "";
  }
  return Math.floor(converted_temp);
}

// Convert mm to inches
function mm_to_in(mm) {
  return mm / 25.4;
}

// Get the precipitation unit ending for the given setting
function get_precipitation_ending() {
  switch (precipitation_unit) {
    case "in":
      return "in";
    case "mm":
      return "mm";
  }
}

// Convert the given mm precipitation to the correct unit based on the precipitation-unit setting
function convert_precipitation(mm) {
  var converted_precipitation;

  // If precipitaion is undefined, then set it to zero
  if (!mm) {
    mm = 0;
  }

  if (precipitation_unit === "in") {
    converted_precipitation =  mm_to_in(mm);
  } else if (precipitation_unit === "mm") {
    converted_precipitation = mm;
  }

  if (header_units === "N") {
    precipitation_ending = " " + get_precipitation_ending();
  } else {
    precipitation_ending = "";
  }
  return Number(converted_precipitation).toFixed(2);
}

// Convert m/s to km/h
function ms_to_kmh(ms) {
  return ms * 3.6;
}

// Convert m/s to mph
function ms_to_mph(ms) {
  return ms * 2.2369362920544;
}

// Get the wind speed unit ending for the given setting
function get_wind_speed_ending() {
  switch (wind_speed_unit) {
    case "km/h":
      return "km/h";
    case "mph":
      return "mph";
    case "m/s":
      return "m/s";
  }

}
// Convert the given m/s wind speed to the correct unit based on the wind-speed-unit setting
function convert_wind_speed(ms) {
  var converted_wind_speed;
  if (wind_speed_unit === "km/h") {
    converted_wind_speed = ms_to_kmh(ms);
  } else if (wind_speed_unit === "mph") {
    converted_wind_speed = ms_to_mph(ms);
  } else if (wind_speed_unit === "m/s") {
    converted_wind_speed = ms;
  }

  if (header_units === "N") {
    wind_speed_ending = " " + get_wind_speed_ending();
  } else {
    wind_speed_ending = "";
  }
  return Number(converted_wind_speed).toFixed(2);
}

// Load configuration settings
function load_config() {
  $.getJSON("config.json", function(data) {
    config_settings = data;

    // Handle optional header-units setting
    header_units = "Y";
    if (config_settings["header-units"] !== undefined) {
      header_units = config_settings["header-units"];
    }

    // Handle optional time-difference setting
    time_difference = 0;
    if (config_settings["time-difference"] !== undefined) {
      time_difference = config_settings["time-difference"];
    }

    // Handle optional ditto-marks setting
    ditto_marks = "''";
    if (config_settings["ditto-marks"] !== undefined) {
      ditto_marks = config_settings["ditto-marks"];
    }

    // Handle optional temp-unit seting
    temp_unit = "F";
    if (config_settings["temp-unit"] !== undefined) {
      temp_unit = config_settings["temp-unit"];
    }

    // Handle optional precipitation-unit setting
    precipitation_unit = "mm";
    if (config_settings["precipitation-unit"] !== undefined) {
      precipitation_unit = config_settings["precipitation-unit"];
    }

    // Handle optional wind-speed-unit setting
    wind_speed_unit = "m/s";
    if (config_settings["wind-speed-unit"] !== undefined) {
      wind_speed_unit = config_settings["wind-speed-unit"];
    }

    load_json();
  });
}

// Load forcast data from json file
var forcast_data;
function load_json() {
  $.getJSON("forcast.json", function(data) {
    forcast_data = data;
    set_fields();
  });
}

// Set the values of the various fields on the page
function set_fields() {
  $('#city').html(forcast_data["city"]["name"]);
  $('#country').html(forcast_data["city"]["country"]);
  $('#weather').html(forcast_data["list"][0]["weather"][0]["main"]);
  $('#description').html(forcast_data["list"][0]["weather"][0]["description"]);
  var time = new Date((forcast_data["list"][0]["dt"] * 1000) + (60 * 60 * 1000 * (time_difference + 2)));
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  $('#time').html(months[time.getMonth()] + " " + time.getDate() + ", " + time.getHours() + ":00");

  // Add the table headers
  var row = "";
  row = row + '<tr>';
  row = row + '<th class="header-date">Date</th>';
  row = row + '<th class="header-time">Time</th>';
  row = row + '<th class="header-weather">Weather</th>';
  if (header_units === "Y") {
    row = row + '<th class="header-precipitation">Precipitation (' + get_precipitation_ending() + ')</th>';
    row = row + '<th class="header-temp">Temperature (' + get_temp_ending() + ')</th>';
    row = row + '<th class="header-cloud-cover">Cloud Cover (%)</th>';
    row = row + '<th class="header-wind-speed">Wind Speed (' + get_wind_speed_ending() + ')</th>';
  } else if (header_units === "N") {
    row = row + '<th class="header-precipitation">Precipitation</th>';
    row = row + '<th class="header-temp">Temperature</th>';
    row = row + '<th class="header-cloud-cover">Cloud Cover</th>';
    row = row + '<th class="header-wind-speed">Wind Speed</th>';
  }
  row = row + '</tr>';
  $('#future-table').append(row);

  // Iterate over the entries and add rows of data on each
  var entries = 20;
  var last_date = "";
  var new_date;
  var last_weather = "";
  var new_weather;
  var last_precipitation = "";
  var new_precipitation;
  var last_temp = "";
  var new_temp;
  var last_cloud_cover = "";
  var new_cloud_cover;
  for(var num = 0; num < entries; num++) {
    row = "";
    row = row + '<tr>\n';

    time = new Date((forcast_data["list"][num]["dt"] * 1000) + (60 * 60 * 1000 * (time_difference + 2)));
    new_date = months[time.getMonth()] + " " + time.getDate();
    // Prevent repetition of dates
    if (new_date !== last_date) {
      row = row + '<td class="row-date" id="' + num + '-date">' + new_date + '</td>';
    } else {
      row = row + '<td class="row-date" id="' + num + '-date"></td>';
    }
    last_date = new_date;
    row = row + '<td class="row-time" id="' + num + '-time">' + time.getHours() + ":00" + '</td>';

    // Prevent repetition of weather
    new_weather = forcast_data["list"][num]["weather"][0]["main"];
    if (new_weather !== last_weather) {
      row = row + '<td class="row-weather" id="' + num + '-weather">' + new_weather + '</td>';
    } else {
      row = row + '<td class="row-weather" id="' + num + '-weather">' + ditto_marks + '</td>';
    }
    last_weather = new_weather;

    var precipitation = 0;
    if (forcast_data["list"][num]["rain"]) {
      precipitation = forcast_data["list"][num]["rain"]["3h"];
    } else if (forcast_data["list"][num]["snow"]) {
      precipitation = forcast_data["list"][num]["snow"]["3h"];
    }
    // Prevent repetition of precipitation
    new_precipitation = precipitation;
    if (new_precipitation !== last_precipitation) {
      row = row + '<td class="row-precipitation" id="' + num + '-precipitation">' + convert_precipitation(new_precipitation) + precipitation_ending + '</td>';
    } else {
      row = row + '<td class="row-precipitation" id="' + num + '-precipitation">' + ditto_marks + '</td>';
    }
    last_precipitation = new_precipitation;


    // Prevent repetition in temperatures
    new_temp = convert_temp(forcast_data["list"][num]["main"]["temp"]);
    if (new_temp !== last_temp) {
      row = row + '<td class="row-temp" id="' + num + '-temp">' + new_temp + temp_ending + '</td>';
    } else {
      row = row + '<td class="row-temp" id="' + num + '-temp">' + ditto_marks + '</td>';
    }
    last_temp = new_temp;

    if (header_units === "N") {
      cloud_cover_ending = " %";
    } else {
      cloud_cover_ending = "";
    }
    // Prevent repetition in cloud cover
    new_cloud_cover = forcast_data["list"][num]["clouds"]["all"];
    if (new_cloud_cover !== last_cloud_cover) {
      row = row + '<td class="row-cloud-cover" id="' + num + '-colud-cover">' + new_cloud_cover + cloud_cover_ending + '</td>';
    } else {
      row = row + '<td class="row-cloud-cover" id="' + num + '-colud-cover">' + ditto_marks + '</td>';
    }
    last_cloud_cover = new_cloud_cover;

   row = row + '<td class="row-wind-speed" id="' + num + '-wind-speed">' + convert_wind_speed(forcast_data["list"][num]["wind"]["speed"]) + wind_speed_ending + '</td>';
    row = row + '<tr>\n';
    $('#future-table').append(row);
  }
}

// Once the document loads, begin reading in from the json file and filling in the fields
$(document).ready(function() {
  load_config();
});

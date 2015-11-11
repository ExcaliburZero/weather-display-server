// Convert Kelvin to Farenheit
function k_to_f(kelvin) {
  return (kelvin - 273.15) * 1.80 + 32.0;
}

// Convert Kelvin to Celcius
function k_to_c(kelvin) {
  return kelvin - 273.15;
}

// Convert the given Kelvin temperature to the correct unit based on the temp-unit config setting
function convert_temp(kelvin) {
  var converted_temp;
  if (temp_unit == "F") {
    converted_temp = k_to_f(kelvin);
    temp_ending = " &deg;F";
  }
  else if (temp_unit == "C") {
    converted_temp = k_to_c(kelvin);
    temp_ending = " &deg;C";
  }
  else if (temp_unit == "K") {
    converted_temp = kelvin;
    temp_ending = " K";
  }
  return Math.floor(converted_temp);
}

// Convert mm to inches
function mm_to_in(mm) {
  return mm / 25.4;
}

// Convert the given mm precipitation to the correct unit based on the precipitation-unit setting
function convert_precipitation(mm) {
  var converted_precipitation;
  if (precipitation_unit == "in") {
    converted_precipitation =  mm_to_in(mm);
    precipitation_ending = " in";
  } else if (precipitation_unit == "mm") {
    converted_precipitation = mm;
    precipitation_ending = " mm";
  }
  return Number(converted_precipitation).toFixed(2);
}

// Load configuration settings
var config_settings;
var time_difference;
var temp_unit;
var temp_ending;
var precipitation_unit;
var precipitation_ending;
function load_config() {
  $.getJSON("config.json", function(data) {
    config_settings = data;

    // Handle optional time-difference setting
    time_difference = 0;
    if (config_settings["time-difference"] != undefined) {
      time_difference = config_settings["time-difference"];
    }

    // Handle optional temp-unit seting
    temp_unit = "F";
    if (config_settings["temp-unit"] != undefined) {
      temp_unit = config_settings["temp-unit"];
    }

    // Handle optional precipitation-unit setting
    precipitation_unit = "mm";
    if (config_settings["precipitation-unit"] != undefined) {
      precipitation_unit = config_settings["precipitation-unit"];
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
  $('#weather').html(forcast_data["list"][1]["weather"][0]["main"]);
  $('#description').html(forcast_data["list"][1]["weather"][0]["description"]);
  var time = new Date((forcast_data["list"][1]["dt"] * 1000) + (60 * 60 * 1000 * (time_difference + 2)));
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  $('#time').html(months[time.getMonth()] + " " + time.getDate() + ", " + time.getHours() + ":00");

  // Iterate over the entries and add rows of data on each
  var entries = 20;
  var row;
  var last_date = "";
  var new_date;
  var last_weather = "";
  var new_weather;
  var last_temp = "";
  var new_temp;
  var last_cloud_cover = "";
  var new_cloud_cover;
  for(var num = 1; num < entries + 1; num++) {
    row = "";
    row = row + '<tr>\n';

    time = new Date((forcast_data["list"][num]["dt"] * 1000) + (60 * 60 * 1000 * (time_difference + 2)));
    new_date = months[time.getMonth()] + " " + time.getDate();
    // Prevent repetition of dates
    if (new_date != last_date) {
      row = row + '<td class="row-date" id="' + num + '-date">' + new_date + '</td>';
    } else {
      row = row + '<td class="row-date" id="' + num + '-date"></td>';
    }
    last_date = new_date;
    row = row + '<td class="row-time" id="' + num + '-time">' + time.getHours() + ":00" + '</td>';

    // Prevent repetition of weather
    new_weather = forcast_data["list"][num]["weather"][0]["main"];
    if (new_weather != last_weather) {
      row = row + '<td class="row-weather" id="' + num + '-weather">' + new_weather + '</td>';
    } else {
      row = row + '<td class="row-weather" id="' + num + '-weather">' + "''" + '</td>';
    }
    last_weather = new_weather;

    var precipitation = 0;
    if (forcast_data["list"][num]["rain"]) {
      precipitation = forcast_data["list"][num]["rain"]["3h"];
    } else if (forcast_data["list"][num]["snow"]) {
      precipitation = forcast_data["list"][num]["snow"]["3h"];
    }
    row = row + '<td class="row-precipitation" id="' + num + '-precipitation">' + convert_precipitation(precipitation) + precipitation_ending + '</td>';

    // Prevent repetition in temperatures
    new_temp = convert_temp(forcast_data["list"][num]["main"]["temp"]);
    if (new_temp != last_temp) {
      row = row + '<td class="row-temp" id="' + num + '-temp">' + new_temp + temp_ending + '</td>';
    } else {
      row = row + '<td class="row-temp" id="' + num + '-temp">' + "''" + '</td>';
    }
    last_temp = new_temp;

    // Prevent repetition in cloud cover
    new_cloud_cover = forcast_data["list"][num]["clouds"]["all"];
    if (new_cloud_cover != last_cloud_cover) {
      row = row + '<td class="row-cloud-cover" id="' + num + '-colud-cover">' + new_cloud_cover + " %" + '</td>';
    } else {
      row = row + '<td class="row-cloud-cover" id="' + num + '-colud-cover">' + "''" + '</td>';
    }
    last_cloud_cover = new_cloud_cover;

   row = row + '<td class="row-wind-speed" id="' + num + '-wind-speed">' + forcast_data["list"][num]["wind"]["speed"] + " m/s" + '</td>';
    row = row + '<tr>\n';
    $('#future-table').append(row);
  }
}

// Once the document loads, begin reading in from the json file and filling in the fields
$(document).ready(function() {
  load_config();
});

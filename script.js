// Convert Kelvin to Farenheit
function k_to_f(kelvin) {
  return Math.floor((kelvin - 273.15) * 1.80 + 32.0);
}

// Load configuration settings
var config_settings;
var time_difference;
function load_config() {
  $.getJSON("config.json", function(data) {
    config_settings = data;
    time_difference = 0;
    if (config_settings["time-difference"] != undefined) {
      time_difference = config_settings["time-difference"];
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
  var time = new Date((forcast_data["list"][1]["dt"] * 1000) + (3600 * time_difference));
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

    time = new Date((forcast_data["list"][num]["dt"] * 1000) + (3600 * time_difference));
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
    row = row + '<td class="row-precipitation" id="' + num + '-precipitation">' + Number(precipitation).toFixed(2) + '</td>';

    // Prevent repetition in temperatures
    new_temp = k_to_f(forcast_data["list"][num]["main"]["temp"]);
    if (new_temp != last_temp) {
      row = row + '<td class="row-temp" id="' + num + '-temp">' + new_temp + '</td>';
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

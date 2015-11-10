// Convert Kelvin to Farenheit
function k_to_f(kelvin) {
  return Math.floor((kelvin - 273.15) * 1.80 + 32.0);
}

// Load configuration settings
var config_settings;
function load_config() {
  $.getJSON("config.json", function(data) {
    config_settings = data;
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
  var time = new Date((forcast_data["list"][1]["dt"] * 1000) + (3600 * config_settings["time-difference"]));
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  $('#time').html(months[time.getMonth()] + " " + time.getDate() + ", " + time.getHours() + ":00");

  // Iterate over the entries and add rows of data on each
  var entries = 20;
  var row;
  for(var num = 1; num < entries + 1; num++) {
    row = "";
    row = row + '<tr>\n';
    time = new Date((forcast_data["list"][num]["dt"] * 1000) + (3600 * config_settings["time-difference"]));
    row = row + '<td class="row-date" id="' + num + '-date">' + months[time.getMonth()] + " " + time.getDate() + '</td>';
    row = row + '<td class="row-time" id="' + num + '-time">' + time.getHours() + ":00" + '</td>';
    row = row + '<td class="row-weather" id="' + num + '-weather">' + forcast_data["list"][num]["weather"][0]["main"] + '</td>';
    var precipitation = 0;
    if (forcast_data["list"][num]["rain"]) {
      precipitation = forcast_data["list"][num]["rain"]["3h"];
    } else if (forcast_data["list"][num]["snow"]) {
      precipitation = forcast_data["list"][num]["snow"]["3h"];
    }
    row = row + '<td class="row-precipitation" id="' + num + '-precipitation">' + Number(precipitation).toFixed(2) + '</td>';
    row = row + '<td class="row-temp" id="' + num + '-temp">' + k_to_f(forcast_data["list"][num]["main"]["temp"]) + '</td>';
    row = row + '<td class="row-cloud-cover" id="' + num + '-colud-cover">' + forcast_data["list"][num]["clouds"]["all"] + " %" + '</td>';
    row = row + '<td class="row-wind-speed" id="' + num + '-wind-speed">' + forcast_data["list"][num]["wind"]["speed"] + " m/s" + '</td>';
    row = row + '<tr>\n';
    $('#future-table').append(row);
  }
}

// Once the document loads, begin reading in from the json file and filling in the fields
$(document).ready(function() {
  load_config();
});

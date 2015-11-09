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
  var time = new Date(forcast_data["list"][1]["dt"] * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  $('#time').html(months[time.getMonth()] + " " + time.getDate() + ", " + time.getHours() + ":00");
}

// Once the document loads, begin reading in from the json file and filling in the fields
$(document).ready(function() {
  load_json();
});

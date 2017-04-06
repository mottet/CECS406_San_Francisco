var urlCSV = "https://data.sfgov.org/api/views/yitu-d5am/rows.csv?accessType=DOWNLOAD"
var urlJSON = "https://data.sfgov.org/api/views/yitu-d5am/rows.json?accessType=DOWNLOAD"
var filename = "lat_longs.csv"

var _data;

var filter_result = [];
var locationsFound = 0;

var _map;
var _myLatLng = {lat: 37.7600537, lng: -122.4445825};
var gmarkers = [];
// var infoWindow; //static infoWindow for all your markers

function initMap() {
  _map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: _myLatLng,
    disableDefaultUI: true,
    zoomControl: true,
    disableDoubleClickZoom: true,
    scrollwheel: false
  });

  // var marker = new google.maps.Marker({
  //   position: myLatLng,
  //   map: map,
  //   title: 'Hello World!'
  // });
}

// google.maps.event.addDomListener(window, 'load', initialize);

function getURLAddress(address) {
  return encodeURI(address + "San Fransisco, CA");
}

function addMarker(data, i) {
  locationsFound++;
  var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">'+ filter_result[i]["Title"] +'</h1>'+
  '<div id="bodyContent">'+
  '<p><b>Location:</b> '+ filter_result[i]["Locations"] +'</p>'+
  '<p><b>Address:</b> '+ data.results[0]['formatted_address'] +'</p>'+
  '<p><b>Director:</b> '+ filter_result[i]["Director"] +'</p>'+
  '<p><b>Actor 1:</b> '+ filter_result[i]["Actor 1"] +'</p>'+
  '<p><b>Release Year:</b> '+ filter_result[i]["Release Year"] +'</p>'+
  '</div>'+
  '</div>';
  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 300
  });
  var marker = new google.maps.Marker({
    position: data.results[0]['geometry']['location'],
    map: _map,
    title: filter_result[i]["Title"]
  });

  // Push your newly created marker into the array:
  gmarkers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(_map, marker);
  });
}

function addCircle(data, i) {
  var marker = new google.maps.Marker({
    position: data.results[0]['geometry']['location'],
    map: _map,
    title: filter_result[i]["Title"]
  });
}

function removeMarkers() {
    for (i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setMap(null);
    }
}

function loadResultsOnMap() {
  var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";

  for (let i = 0; i < filter_result.length; i++) {
    var SEARCH_URL = BASE_URL + getURLAddress(filter_result[i]["Locations"]);
    if (filter_result[i]["Locations"]) {
      // console.log("Locations = " + filter_result[i]["Locations"]);
      // console.log("URL = " + SEARCH_URL);

      d3.json(SEARCH_URL, function(data) {
        if (data.status === "ZERO_RESULTS") {
          console.log("Google Maps API: Zero Results");
        } else if (data.status === "UNKNOWN_ERROR") {
          console.log("Google Maps API: Unknown Error");
        }
        if (data.results.length === 0) {
          console.log("Location not found!");
        } else {
          console.log("i = " + i)
          console.log("URL = " + SEARCH_URL);
          console.log("Formatted Address = " + data.results[0]['formatted_address']);
          console.log(data.results[0]['geometry']['location']);
          // console.log(filter_result);
          if (document.getElementById('selection').value == "Locations") {
              console.log("search by location");
              // addCircle(data, i);
              // break;
          } else {
            addMarker(data, i);
          }
        }
      });

    } else {
      console.log("Location is empty.");
    }
  }

  document.getElementById('nb-results').innerHTML = filter_result.length + " entries in the dataset, " + locationsFound + " locations on map.";
}

// callback function wrapped for loader in 'init' function
function init() {
  // load json data and trigger callback
  d3.csv(filename, function(error, data) {
    // instantiate chart within callback
    // chart(data);
    _data = data;
  });
}

init();

function getDataByYear(from, to) {
  let result = [];
  for (var i = 0; i < _data.length; i++) {
    let year = Number(_data[i]["Release Year"]);
    if (year !== NaN && year >= from && year <= to) {
      result.push(_data[i]);
    }
  }
  // console.log(result);
  filter_result = result;
}

$ (function () {
  $( "#slider-range" ).slider({
    range: true,
    min: 1930,
    max: 2017,
    values: [ 1990, 2010 ],
    slide: function( event, ui ) {
      console.log("lol");
      $( "#year" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      getDataByYear(ui.values[0], ui.values[1]);
    }
  });

  $( "#year" ).val( $( "#slider-range" ).slider( "values", 0 ) +
  " - " + $( "#slider-range" ).slider( "values", 1 ) );

  if ( document.getElementById('pac-input').value !== "")
  document.getElementById("slider").style="display: none;";
});

function alreadyIn(result, key, test) {
  for (var i = 0; i < result.length; i++)
  {
    if (result[i][key] === test)
    return true;
  }
  return false;
}

function showAutocompleteResult(str, key) {
  document.getElementById("autocomplete").innerHTML = "";
  if (str.length > 0) {
    console.log("OK");
    let result = [];
    for (var i = 0; i < _data.length; i++) {
      if (_data[i][key].toLowerCase().includes(str.toLowerCase()) && !alreadyIn(result, key, _data[i][key])) {
        result.push(_data[i]);
        document.getElementById("autocomplete").innerHTML += "<option value=\"" + _data[i][key] + "\" onclick=\"myFunction()\">";
        if (result.length === 5) {
          break;
        }
      }
    }
    return result;
  }
}

function onInput() {
  locationsFound = 0;
  removeMarkers();
  var val = document.getElementById("pac-input").value;
  var opts = document.getElementById('autocomplete').childNodes;
  var key = document.getElementById('selection').value;
  for (var i = 0; i < opts.length; i++) {
    if (opts[i].value === val) {

      let result = [];
      for (var i = 0; i < _data.length; i++) {
        if (_data[i][key].toLowerCase().includes(val.toLowerCase())) {
          result.push(_data[i]);
        }
      }
      console.log(result);
      filter_result = result;

      loadResultsOnMap();

      // var marker = new google.maps.Marker({
      //   position: _myLatLng,
      //   map: _map,
      //   title: 'Hello World!'
      // });

      break;
    }
  }
}

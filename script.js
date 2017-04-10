var urlCSV = "https://data.sfgov.org/api/views/yitu-d5am/rows.csv?accessType=DOWNLOAD";
var urlJSON = "https://data.sfgov.org/api/views/yitu-d5am/rows.json?accessType=DOWNLOAD";
var urlCleanCSV = "https://drive.google.com/uc?export=download&id=0B7SrFhv8dgx8VkwzMmlJQl80SGM";
var filenameCleanCSV = "dataset/lat_longs.csv";

var _data;

var filter_result = [];
var location_result = [];
var locationsFound = 0;

var _map;
var _myLatLng = {lat: 37.7600537, lng: -122.4445825};
var gmarkers = [];
var gcircles = [];
var lastOpenedInfoWindow;

var _from = 1990;
var _to = 2010;
var _showMarkers = false;

function initMap() {
  _map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: _myLatLng,
    disableDefaultUI: true,
    zoomControl: true,
    disableDoubleClickZoom: true,
    scrollwheel: false
  });
}

// google.maps.event.addDomListener(window, 'load', initialize);

function init() {
  d3.csv(filenameCleanCSV, function(data) {
    _data = data;
    filter_result = _data;
    firstLoad();
    // loadResultsOnMap();
  });
}

init();

function toggleCheckbox(element) {
  _showMarkers = element.checked;
  if (element.checked) {
    removeCircles();
    loadResultsOnMap();
  } else {
    removeMarkers();
  }
}

function getURLAddress(address) {
  return encodeURI(address + "San Francisco, CA");
}

function closeLastOpenedInfoWindow() {
  if (lastOpenedInfoWindow) {
    lastOpenedInfoWindow.close();
  }
}

function addMarker(i) {
  var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">'+ filter_result[i]["Title"] +'</h1>'+
  '<div id="bodyContent">'+
  '<p><b>Location:</b> '+ filter_result[i]["Locations"] +'</p>'+
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
    position: {lat: parseFloat(filter_result[i]["lat"]), lng: parseFloat(filter_result[i]["lng"])},
    map: _map,
    title: filter_result[i]["Title"]
  });

  // Push your newly created marker into the array:
  gmarkers.push(marker);

  google.maps.event.addListener(marker, 'click', function() {
    closeLastOpenedInfoWindow();
    infowindow.setContent(contentString);
    infowindow.open(_map, marker);
    lastOpenedInfoWindow = infowindow;
  });
}

function addCircle(i) {
  if (_showMarkers) {
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">'+ location_result[i]["location"] +'</h1>'+
    '<div id="bodyContent">' +
    '<p><b>Number of films in that location:</b> '+ location_result[i]["movies"].length +'</p>'+
    '<p>';
    for (var j = 0; j < location_result[i]["movies"].length; j++) {
      contentString += location_result[i]["movies"][j] +'<br />';
    }
    contentString += '</p></div></div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 300
    });
    var icon = {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      scaledSize: new google.maps.Size(16, 16)
    };
    var marker = new google.maps.Marker({
      icon: icon,
      position: {lat: parseFloat(location_result[i]["lat"]), lng: parseFloat(location_result[i]["lng"])},
      map: _map,
      title: location_result[i]["location"]
    });
    gmarkers.push(marker);

    google.maps.event.addListener(marker, 'click', function() {
      closeLastOpenedInfoWindow();
      infowindow.setContent(contentString);
      infowindow.open(_map, marker);
      lastOpenedInfoWindow = infowindow;
    });
  }

  var colorValue = '';
  switch (location_result[i]["movies"].length) {
    case 1:
      colorValue = '#A579F3';
      break;
    case 2:
      colorValue = '#9A6FEF';
      break;
    case 3:
      colorValue = '#8F66EA';
      break;
    case 4:
      colorValue = '#835DE5';
      break;
    case 5:
      colorValue = '#7754DE';
      break;
    case 6:
      colorValue = '#6C4BD6';
      break;
    case 7:
      colorValue = '#6043CE';
      break;
    case 8:
      colorValue = '#553BC4';
      break;
    case 9:
      colorValue = '#4933BA';
      break;
    case 10:
      colorValue = '#3E2CAE';
      break;
    case 11:
      colorValue = '#3325A2';
      break;
    case 14:
      colorValue = '#281F95';
      break;
    case 21:
      colorValue = '#1D1988';
      break;
    case 28:
      colorValue = '#131379';
      break;
    default:
      colorValue = '#FF0000';
  }
  var circle = new google.maps.Circle({
    strokeColor: colorValue,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: colorValue,
    fillOpacity: 0.35,
    map: _map,
    center: {lat: parseFloat(location_result[i]["lat"]), lng: parseFloat(location_result[i]["lng"])},
    radius: Math.sqrt(location_result[i]["movies"].length) * 300
  });
  gcircles.push(circle);
}

function removeMarkers() {
  for (i = 0; i < gmarkers.length; i++) {
    gmarkers[i].setMap(null);
  }
}

function removeCircles() {
  for (i = 0; i < gcircles.length; i++) {
    gcircles[i].setMap(null);
  }
}

function inAlready(result, nb) {
  for (var i = 0; i < result.length; i++) {
    if (result[i] === nb) {
      return true;
    }
  }
  return false;
}

function loadResultsOnMap() {
  locationsFound = 0;
  removeMarkers();
  removeCircles();
  if (document.getElementById('selection').value == "Locations") {
    // var sizeList = [];
    for (var i = 0; i < location_result.length; i++) {
      if (location_result[i]["Release Year"] >= _from && location_result[i]["Release Year"] <= _to) {
        addCircle(i);
        locationsFound++;
      }
      // if (!inAlready(sizeList, location_result[i]["movies"].length)) {
      //   sizeList.push(location_result[i]["movies"].length);
      // }
    }
    // console.log(sizeList.sort(function compareNumbers(a, b) { return a - b; }));
  } else {
    for (var i = 0; i < filter_result.length; i++) {
      if (filter_result[i]["Release Year"] >= _from && filter_result[i]["Release Year"] <= _to) {
        addMarker(i);
        locationsFound++;
      }
    }
  }
  document.getElementById('nb-results').innerHTML = filter_result.length + " entries in the dataset, " + locationsFound + " locations on map.";
}

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
    values: [ _from, _to ],
    slide: function( event, ui ) {
      console.log("year range selection");
      $( "#year" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
      _from = ui.values[0];
      _to = ui.values[1];
      loadResultsOnMap();
      // getDataByYear(ui.values[0], ui.values[1]);
    }
  });

  $( "#year" ).val( $( "#slider-range" ).slider( "values", 0 ) + " - " + $( "#slider-range" ).slider( "values", 1 ) );

  if (document.getElementById('pac-input').value !== "") {
    document.getElementById("slider").style="display: none;";
  }
});

function alreadyIn(result, key, test) {
  for (var i = 0; i < result.length; i++) {
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
  removeCircles();
  var val = document.getElementById("pac-input").value;
  var opts = document.getElementById("autocomplete").childNodes;
  var key = document.getElementById("selection").value;
  for (var i = 0; i < opts.length; i++) {
    if (opts[i].value === val) {
      let result = [];
      for (var i = 0; i < _data.length; i++) {
        if (_data[i][key].toLowerCase().includes(val.toLowerCase())) {
          result.push(_data[i]);
        }
      }
      filter_result = result;
      if (document.getElementById('selection').value == "Locations") {
        location_result = result;
        firstLoad();
      } else {
        loadResultsOnMap();
      }

      break;
    }
  }
}

function checkDuplicates(result, lat, lng) {
  for (var i = 0; i < result.length; i++) {
    if (result[i]["lat"] === lat && result[i]["lng"] === lng) {
      return i;
    }
  }
  return 0;
}

function firstLoad() {
  let result = [];
  for (var i = 0; i < filter_result.length; i++) {
    var latValue = parseFloat(filter_result[i]["lat"]);
    var lngValue = parseFloat(filter_result[i]["lng"]);
    var ret = checkDuplicates(result, latValue, lngValue);
    if (ret === 0) {
      result.push({location: filter_result[i]["Locations"], "Release Year": filter_result[i]["Release Year"], movies: [filter_result[i]["Title"]], lat: latValue, lng: lngValue});
      // console.log("new entry");
    } else {
      result[ret]["movies"].push(filter_result[i]["Title"]);
      // console.log("already in => " + i);
    }
  }
  // console.log(result);
  location_result = result;
  loadResultsOnMap();
  // console.log(filter_result);
}

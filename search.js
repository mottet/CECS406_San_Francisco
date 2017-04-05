var urlCSV = "https://data.sfgov.org/api/views/yitu-d5am/rows.csv?accessType=DOWNLOAD"
var urlJSON = "https://data.sfgov.org/api/views/yitu-d5am/rows.json?accessType=DOWNLOAD"

var _data;

var filter_result = [];

// callback function wrapped for loader in 'init' function
function init() {
  // load csv data and trigger callback
  d3.csv(urlCSV, function(data) {
    _data = data;
  });
}

init();

function getDataByYear(from, to)
{
    let result = [];
    for (var i = 0; i < _data.length; i++) {
	let year = Number(_data[i]["Release Year"]);
	if (year !== NaN && year >= from && year <= to) {
	    result.push(_data[i]);
	}
    }
    console.log(result);
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

    if ( document.getElementById('input').value !== "")
      document.getElementById("slider").style="display: none;";
});

function chart(str, key) {
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

function alreadyIn(result, key, test) {
  for (var i = 0; i < result.length; i++)
  {
    if (result[i][key] === test)
    return true;
  }
  return false;
}

function showResult(str, key) {
  document.getElementById("autocomplete").innerHTML = "";
  if (str.length == 0) {
    getDataByYear($("#slider-range").slider("values", 0), $("#slider-range").slider("values", 1));
  	document.getElementById("slider").style="display: block;";
  } else {
    document.getElementById("slider").style="display: none;";
    chart(str, key);
  }
}

function onInput() {
  var val = document.getElementById("input").value;
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
      break;
    }
  }
}

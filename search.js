var urlCSV = "https://data.sfgov.org/api/views/yitu-d5am/rows.csv?accessType=DOWNLOAD"
var urlJSON = "https://data.sfgov.org/api/views/yitu-d5am/rows.json?accessType=DOWNLOAD"

// loader settings
var target = document.getElementById('#chart-id');

var _data;

// callback function wrapped for loader in 'init' function
function init() {
  // load json data and trigger callback
  d3.csv(urlCSV, function(data) {
    // instantiate chart within callback
    // chart(data);
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
    return result;
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
      document.getElementById("result").innerHTML += "<option value =\"" + _data[i][key] + "\">";
      if (result.length === 5) {
        break;        
      }
    }
  }
  console.log(result);
  return result;
}

function alreadyIn(result, key, test)
{
  for (var i = 0; i < result.length; i++)
  {
    if (result[i][key] === test)
    return true;
  }
  return false;
}

function showResult(str, key) {
  document.getElementById("result").innerHTML = "";
    if (str.length == 0) {
	getDataByYear($("#slider-range").slider("values", 0), $("#slider-range").slider("values", 1));
	document.getElementById("slider").style="display: block;";
    } else {
	document.getElementById("slider").style="display: none;";
	chart(str, key);
    }
}

// var data;
//
// d3.csv("data.csv", function (error, _data)
// {
//   console.log(error);
//   data = _data;
//   console.log(_data);
// });

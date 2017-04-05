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

function chart(str, key) {
  console.log("OK");
  for (var i = 0; i < _data.length; i++) {
    if (_data[i][key].toLowerCase().includes(str.toLowerCase())) {
      // document.getElementById("").innerHTML += "<p>" + _data[i][key] + "</p>";
      document.getElementById("result").innerHTML += "<option value =\"" + _data[i][key] + "\">";
    }
  }
}

function showResult(str, key) {
  document.getElementById("result").innerHTML = "";
  if (str.length == 0) {
    document.getElementById("livesearch").innerHTML = "";
    document.getElementById("livesearch").style.border = "0px";
  } else {
    document.getElementById("livesearch").innerHTML = key + ": " + str;
    document.getElementById("livesearch").style.border = "1px solid #A5ACB2";
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

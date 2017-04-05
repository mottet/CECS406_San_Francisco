
function showResult(str, key)
{
    if (str.lenght == 0)
    {
	document.getElementById("livesearch").innerHTML="";
	document.getElementById("livesearch").style.border="0px";
    }
    else
    {
	document.getElementById("livesearch").innerHTML = key + ": " + str;
	document.getElementById("livesearch").style.border="1px solid #A5ACB2";
    }
}


var data;

d3.csv("data.csv", function (error, _data)
{
    console.log(error);
    data = _data;
    console.log(_data);    
});

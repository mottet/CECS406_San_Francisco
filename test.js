<button onclick="addMarker()">Click Me</button>
<div id="map-canvas"></div>

<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>

<script>

var map
var myLatlng = new google.maps.LatLng(-25.363882,131.044922);

function initialize() {
  var googleMapOptions = {
    zoom: 4,
    center: myLatlng
  };

  map = new google.maps.Map(document.getElementById("map-canvas"), googleMapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);

function addMarker() {
  var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
  '<div id="bodyContent">'+
  '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
  'sandstone rock formation in the southern part of the '+
  '<p>Attribution: Uluru, <a href="http://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
  'http://en.wikipedia.org/w/index.php?title=Uluru</a> '+
  '(last visited June 22, 2009).</p>'+
  '</div>'+
  '</div>';
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title: 'Uluru (Ayers Rock)'
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });


}
</script>

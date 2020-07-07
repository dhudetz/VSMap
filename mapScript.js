// Map options
var mapStyle = [{
  'featureType': 'all',
  'elementType': 'all',
  'stylers': [{'visibility': 'off'}]
}, {
  'featureType': 'landscape',
  'elementType': 'geometry',
  'stylers': [{'visibility': 'on'}, {'color': '#BAD9A2'}]
}, {
  'featureType': 'water',
  'elementType': 'labels',
  'stylers': [{'visibility': 'off'}]
}, {
  'featureType': 'water',
  'elementType': 'geometry',
  'stylers': [{'visibility': 'on'}, {'hue': '#9DC4B5'}, {'lightness': 60}]
}];
var options = {
  zoom:4,
  center:{lat:39.50,lng:-98.35},
  streetViewControl: false,
  styles:mapStyle
}

var map;

function initMap(){
  // New map
  map = new google.maps.Map(document.getElementById('map'), options);
  drawPoints();
}
function suppressionPoint(location, type, description) {
    this.location = location;
    this.type = type;
    this.content = description;
}
function drawPoints(){
  var suppressionPoints = [
    new suppressionPoint({lat:42.4668,lng:-70.9495},0,"Extremly long lines spotted"),
    new suppressionPoint({lat:42.8584,lng:-70.9300},1,"Polls shut down"),
    new suppressionPoint({lat:42.7762,lng:-71.0773},2,"No transportation"),
    new suppressionPoint({lat:41.8781,lng:-87.6298},2,"No transportation")
  ];

  // Loop through markers
  for(var i = 0;i < suppressionPoints.length;i++){
    addCircle(suppressionPoints[i]);
    devLog(suppressionPoints[i].content);
  }
}

// Add Marker Function
function addCircle(sp){
  var circleMarker = new google.maps.Circle({
    strokeColor: "#000000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillOpacity: 0.35,
    fillColor: "#000000",
    map: map,
    center: sp.location,
    radius: 10000
  });
  switch(sp.type){
    case 0:
      circleMarker.fillColor="#00FF00";
      break;
    case 1:
      circleMarker.fillColor="#FF0000";
      break;
    case 2:
      circleMarker.fillColor="#0000FF";
      break;
  }
  if(sp.content){
    var infoWindow = new google.maps.InfoWindow({
      content:sp.content
    });
    google.maps.event.addListener(circleMarker, 'click', function(ev){
      infoWindow.setPosition(circleMarker.getCenter());
      infoWindow.open(map);
    });
  }
}

function devLog(text){
  document.getElementById('hello').textContent=
  document.getElementById('hello').textContent+text+"\n";
}

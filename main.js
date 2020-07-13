window.onload = init;
window.onresize = function()
{
  setTimeout(map.updateSize(), 200);
}

var map;
function init(){
  map = new ol.Map({
    view: new ol.View({
      center:[-10692079, 4855956],
      zoom: 1,
      maxZoom: 10,
      //minZoom: 1,
      extent: [-20000000,1420000,-5130000,12750000]
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map'
  })

  map.on('click', function(e){
    console.log(e.coordinate);
  })
  //toggleFullScreen("#map");
}

function toggleFullScreen(mapContainer) {
  if ($(mapContainer).hasClass("normal")) {
      $(mapContainer).addClass("fullscreen").removeClass("normal");
  } else {
      $(mapContainer).addClass("normal").removeClass("fullscreen");
  }
  map.updateSize();
}

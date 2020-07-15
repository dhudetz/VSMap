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

  //Vector layers
  const districtsGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/districts.json',
      format: new ol.format.GeoJSON()
    }),
    visible: true,
    title: 'DistrictsGeoJSON'
  })

  const statesGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: './data/states.json',
      format: new ol.format.GeoJSON()
    }),
    visible: true,
    title: 'StatesGeoJSON'
  })

  //map.addLayer(districtsGeoJSON);
  const openStreetMapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png'
    }),
    visbile: true,
    title: 'OSMHumanitarian'
  })
  map.removeLayer();

  var currZoom = map.getView().getZoom();
  map.on('moveend', function(e) {
    var newZoom = map.getView().getZoom();
    if (currZoom != newZoom) {
      if(newZoom >= 6){
        map.removeLayer(statesGeoJSON);
        map.addLayer(districtsGeoJSON);
      }
      else{
        map.removeLayer(districtsGeoJSON);
        map.addLayer(statesGeoJSON);
      }
      currZoom = newZoom;
    }
  });

  map.on('click', function(e){
    console.log(e.coordinate);
  })
  //toggleFullScreen("#map");
  //toggleFullScreen("#map");
}

// Toggling class of map div
function toggleFullScreen(mapContainer) {
  if ($(mapContainer).hasClass("normal")) {
      $(mapContainer).addClass("fullscreen").removeClass("normal");
  } else {
      $(mapContainer).addClass("normal").removeClass("fullscreen");
  }
  map.updateSize();
}

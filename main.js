window.onload = init;
window.onresize = function()
{
  setTimeout(map.updateSize(), 200);
}

var map;
const fs = require('fs');

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
      url: 'https://theunitedstates.io/districts/cds/2012/NY-2/shape.geojson',
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
        loadStateDistricts('NY');
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

/*Function for loading and displaying all districts
of a state*/
function loadStateDistricts(state){
  var numDistricts;
  //jsonReader to get numberOfDistricts
  /*jsonReader('data/numberOfDistricts.json', (err, country) => {
    if (err) {
        console.log(err)
        return
    }
    numDistricts=country[state];
  })*/
  numDistricts=30;
  console.log(numDistricts);
  //Loop through the districts for this state
  for(var i = 1; i<=numDistricts; i++){
    const districtsGeoJSON = new ol.layer.VectorImage({
      source: new ol.source.Vector({
        url: 'https://theunitedstates.io/districts/cds/2012/'+state+'-'+i.toString()+'/shape.geojson',
        format: new ol.format.GeoJSON()
      }),
      visible: true,
      title: 'DistrictsGeoJSON'
    })
    map.addLayer(districtsGeoJSON);
  }
}

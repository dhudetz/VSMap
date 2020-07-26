//import Select from '/ol/interaction/Select';

window.onload = init;
window.onresize = function()
{
  setTimeout(map.updateSize(), 200);
}

var numDistrictsJson;
//get json of number of districts for each state
$.getJSON("./data/numberOfDistricts.json", function(json) {
  numDistrictsJson=json;
});

const zoomCutOff=5;
var map;
//const fs = require('fs');

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
  /*const districtsGeoJSON = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: 'https://theunitedstates.io/districts/cds/2012/NY-2/shape.geojson',
      format: new ol.format.GeoJSON()
    }),
    visible: true,
    title: 'DistrictsGeoJSON'
  })*/

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
  //map.removeLayer();

  var select = new ol.interaction.Select({
    //condition: ol.click
  });
  map.addInteraction(select);
    select.on('select', function(e) {
      document.getElementById('status').innerHTML = '&nbsp;' +
          e.target.getFeatures().getLength() +
          ' selected features (last operation selected ' + e.selected.length +
          ' and deselected ' + e.deselected.length + ' features)';
  });
  //Loading/unloading states and districts depending on zoom level
  var currZoom = map.getView().getZoom();
  map.addLayer(statesGeoJSON);
  map.on('moveend', function(e) {
    var newZoom = map.getView().getZoom();
    if (currZoom != newZoom) {
      if(newZoom >= zoomCutOff && currZoom < zoomCutOff){
        map.removeLayer(statesGeoJSON);
        loadStateDistricts('NY');
      }
      else if(newZoom < zoomCutOff && currZoom >= zoomCutOff){
        unloadStateDistricts();
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

//Holds all of the currently loaded districts
var loadedDistricts = new Array(55);

/*Function for loading and displaying all districts
of a state*/
function loadStateDistricts(state){
  var numDistricts=numDistrictsJson[state];
  console.log(numDistricts);
  //Loop through the districts for this state
  loadedDistricts = new Array(numDistricts);
  for(var i = 1; i<=numDistricts; i++){
    const districtsGeoJSON = new ol.layer.VectorImage({
      source: new ol.source.Vector({
        url: 'https://theunitedstates.io/districts/cds/2012/'+state+'-'+i.toString()+'/shape.geojson',
        format: new ol.format.GeoJSON()
      }),
      visible: true,
      title: 'DistrictsGeoJSON'
    })
    loadedDistricts[i-1]=districtsGeoJSON;
    map.addLayer(districtsGeoJSON);
  }
}

function unloadStateDistricts(){
  for(var i = 0; i<loadedDistricts.length; i++){
    map.removeLayer(loadedDistricts[i]);
  }
}

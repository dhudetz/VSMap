//import Select from '/ol/interaction/Select';

window.onload = init;
window.onresize = function()
{
  setTimeout(map.updateSize(), 200);
}

// Variables for zooming in on a selected state
var regionClicked = false;
var coordinateRecieved = null;
var stateMode = true;
var numDistrictsJson,stateAbbreviationsJson;
//get json of number of districts for each state
$.getJSON("./data/numberOfDistricts.json", function(json) {
  numDistrictsJson=json;
});

$.getJSON("./data/stateAbbreviations.json", function(json) {
  stateAbbreviationsJson=json;
});

const statesGeoJSON = new ol.layer.VectorImage({
  source: new ol.source.Vector({
    url: './data/states.json',
    format: new ol.format.GeoJSON()
  }),
  visible: true,
  title: 'StatesGeoJSON'
})

const zoomCutOff=5.9;
var map;
//const fs = require('fs');

var view = new ol.View({
  center:[-10692079, 4855956],
  zoom: 1,
  maxZoom: 10,
  //minZoom: 1,
  extent: [-20000000,1420000,-5130000,12750000]
});

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay;

function init(){
  //create overlay for popup messages
  overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    }
  });

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  // Still need to research what attributions i actually have to make
  var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
  map = new ol.Map({
    view: view,
    overlays: [overlay],
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map'
  })

  var select = new ol.interaction.Select();
  map.addInteraction(select);
  select.on('select', function (e) {

  });

  map.on('click', function(e){
    map.forEachFeatureAtPixel(e.pixel, function(f){
      console.log(f.get("NAME"));
      coordinateRecieved = e.coordinate;
      regionClicked=true;
      //opening the state based off selected name
      selectRegion(f.get("NAME"));
    })
    /*var districtView = new ol.View({
      center:e.coordinate,
      zoom: 7,
      maxZoom: 10,
      minZoom: 5,
      extent: [-20000000,1420000,-5130000,12750000]
    });*/
  })
  //Loading/unloading states and districts depending on zoom level
  var currZoom = map.getView().getZoom();
  map.addLayer(statesGeoJSON);
  map.on('moveend', function(e) {
    var newZoom = map.getView().getZoom();
    if (currZoom != newZoom) {
      if(!stateMode && newZoom < zoomCutOff && currZoom >= zoomCutOff){
        unloadStateDistricts();
        map.addLayer(statesGeoJSON);
        stateMode= true;
      }
      currZoom = newZoom;
    }
  });
}

//Holds all of the currently loaded districts
var loadedDistricts = new Array(55);

/*Function for loading and displaying all districts
of a state*/
function loadStateDistricts(state){
  var numDistricts=numDistrictsJson[state];
  //Loop through the districts for this state
  loadedDistricts = new Array(numDistricts);
  var startCount,endCount;
  if (numDistricts==1){
    startCount=0;
    endCount=numDistricts-1;
  }
  else{
    startCount=1;
    endCount=numDistricts;
  }
  for(var i = startCount; i<=endCount; i++){
    var strokeColor,fillColor;
    if (i%3==0){
      strokeColor = '#000';
      fillColor = 'rgba(255,0,255,0.2)';
    }
    else if (i%2==0){
      strokeColor = '#000';
      fillColor = 'rgba(255,255,0,0.2)';
    }
    else{
      strokeColor = '#000';
      fillColor = 'rgba(0,255,255,0.2)';
    }
    const districtsGeoJSON = new ol.layer.VectorImage({
      source: new ol.source.Vector({
        url: 'https://theunitedstates.io/districts/cds/2012/'+state+'-'+i.toString()+'/shape.geojson',
        format: new ol.format.GeoJSON()
      }),
      visible: true,
      title: 'DistrictsGeoJSON',
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: strokeColor,
          width: 1,
        }),
        fill: new ol.style.Fill({
          color: fillColor,
        })
      })
    })
    loadedDistricts[i-startCount]=districtsGeoJSON;
    map.addLayer(districtsGeoJSON);
  }
}

var fakeCount=0;
function selectRegion(stateName){
  if(regionClicked && coordinateRecieved!=null){
    if(stateMode==true){
      stateMode=false;
      map.removeLayer(statesGeoJSON);
      loadStateDistricts(stateAbbreviationsJson[stateName]);
      view.setCenter(coordinateRecieved);
      view.setZoom(6);
      coordinateRecieved=null;
      regionClicked=false;
    }
    else{
      regionClicked=false;
      if(fakeCount%3==0){
        content.innerHTML = '<p>No early voting</p>';
      }
      else if(fakeCount%2==0){
        content.innerHTML = '<p>Federal military spotted on 18th street polling.</p>';
      }
      else{
        content.innerHTML = '<p>This district has many reports of ' + fakeCount + 'hour+ lines</p>';
      }
      fakeCount++;
      overlay.setPosition(coordinateRecieved);
    }
  }
}

function unloadStateDistricts(){
  for(var i = 0; i<loadedDistricts.length; i++){
    map.removeLayer(loadedDistricts[i]);
  }
}

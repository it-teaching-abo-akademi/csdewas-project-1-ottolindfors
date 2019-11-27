// Run when DOM has loaded (use "load" to wait till all content has loaded)
document.addEventListener("DOMContentLoaded", function (event) {
    drawMap();
});

// Add event listener for showRoute button
document.getElementById("showRoute").addEventListener("click", function(){
    drawShape();
});

let map;
const inilat = 60.4545;
const inilon = 22.2648;

function drawMap() {
    let tile = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    let view = new ol.View({
        center: ol.proj.fromLonLat([inilon, inilat]),
        zoom: 12
    });
    map = new ol.Map({
        target: 'mymap',
        layers: [tile],
        view: view
    });
}

function drawShape() {
    let data;
    let request = new XMLHttpRequest();

    request.open('GET', 'http://data.foli.fi/gtfs/v0/20191114-135003/shapes/0_201', true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            data = JSON.parse(this.response);  // 'this' referes to 'request'
            let coordinates = data.map(coord => ol.proj.fromLonLat([coord.lon, coord.lat]));
            drawLine(coordinates);
        }
    };
    request.send();
}

function drawLine(coordinates) {
    lineLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.LineString(coordinates)
                })
            ]
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 3
            })
        })
    });
    map.addLayer(lineLayer);
}
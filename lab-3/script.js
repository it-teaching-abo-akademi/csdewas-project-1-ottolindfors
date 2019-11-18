var map;
var inilat = 60.4529;
var inilon = 22.2798;

function drawMap() {
    console.log('hello');
    map = new ol.Map({
        target: 'mymap',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([inilon, inilat]),
            zoom: 12
        })
    });
}

function drawLine(coordinates) {
    //coordinates = [[60.4529, 22.2798], [60.3529, 22.1798]];
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
                color: 'palegreen',
                width: 3
            })
        })
    });

    map.addLayer(lineLayer);

}

function getShape() {

    let data;

    var request = new XMLHttpRequest();
    request.open('GET', 'http://data.foli.fi/gtfs/v0/20191114-135003/shapes/0_201', true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            data = JSON.parse(this.response);  // 'this' referes to 'request'
            var coordinates = data.map(coord => ol.proj.fromLonLat([coord.lon, coord.lat]));
            console.log(coordinates);
            drawLine(coordinates);
            // drawLine();
        }
    };

    request.send();

}

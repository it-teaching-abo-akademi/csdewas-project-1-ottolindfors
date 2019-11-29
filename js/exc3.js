/*
Run when DOM has loaded.
Note to self: Use "load" instead of "DOMContentLoaded" to wait till all content has loaded.
 */
document.addEventListener("DOMContentLoaded", function (event) {
    fetchRoutes();
    drawMap();
});

let map;
const inilat = 60.4545;
const inilon = 22.2648;
let routeData = [];  // route_short_name, route_long_name, route_id

/*
Draws a basic map.
 */
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

/*
Fetch routes and add them to the drop down.
*/
function fetchRoutes() {
    const routesUrl = "https://data.foli.fi/gtfs/routes";
    fetch(routesUrl)
        .then(function (response) {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
            else {
                console.log("Could not fetch bus lines :-S " + response.status);
            }
        })
        .then(function (data) {
            data.map(
                functionInput => routeData.push(
                    {
                        route_short_name: functionInput.route_short_name,
                        route_long_name: functionInput.route_long_name,
                        route_id: functionInput.route_id
                    }
                )
            );
            updateBusList(routeData);
        })
        .catch(function (err) {
            console.log("Something went wrong :-S " + err);
        })
}

/*
Populate the drop down list.
 */
function updateBusList(arr) {
    arr.sort();
    for (i=0; i<arr.length; i++) {
        var option = document.createElement("option");
        option.value = arr[i].route_id;
        option.innerHTML = arr[i].route_short_name + " - " + arr[i].route_long_name;
        document.getElementById("busList").appendChild(option);
    }
}

/*
Draw a bus line (shape) on the map.
 */
function drawBusLine(coordinates) {
    // Build the shape
    let vector = new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.LineString(coordinates)
            })
        ]
    });
    // Add some styling
    let style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
        })
    });
    // Make an object that can be added to the map
    lineLayer = new ol.layer.Vector({
        source: vector,
        style: style
    });
    // Add the shape to the map
    map.addLayer(lineLayer);
}

// Run when DOM has loaded (use "load" to wait till all content has loaded)
document.addEventListener("DOMContentLoaded", function (event) {
    fetchRoutes();
    drawMap();
});

// Add event listener for showRoute button
document.getElementById("showRoute").addEventListener("click", function(){
    fetchData();
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

function fetchData() {
    const url = 'http://data.foli.fi/gtfs/v0/20191114-135003/shapes/0_201';
    // TODO: Get url from selected route
    // Generate url instead of static url
    fetch(url)
        .then(function (response) {
            // The JSON data will arrive here
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
            else {
                alert("Could not fetch shape :-S\n\n(Response status: " + response.status + ")");
                console.log(response.status);
            }
        })
        .then(function (data) {
            // Iterate through each element in data with map() and extract the long and lat
            let coordinates = data.map(coord => ol.proj.fromLonLat([coord.lon, coord.lat]));  // https://www.w3schools.com/jsref/jsref_map.asp
            // Draw the bus line on the map
            drawBusLine(coordinates);
        })
        .catch(function (err) {
            console.log("Something went wrong :-S " + err);
            alert("Something went wrong :-S\n(Developer, see console for more information.)")
        })
}

function drawBusLine(coordinates) {
    // Build the entire shape
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

function fetchRoutes() {
    /*
    Fetch routes and add them to the drop down
     */
    const url = "http://data.foli.fi/gtfs/routes";

    fetch(url)
        .then(function (response) {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
            else {
                alert("Could not fetch bus lines :-S\n\n(Response status: " + response.status + ")");
                console.log(response.status);
            }
        })
        .then(function (data) {
            let routes = [];
            data.map(
                functionInput => routes.push(
                    {route_short_name: functionInput.route_short_name, route_long_name: functionInput.route_long_name }
                )
            );
            updateBusList(routes);
        })
        .catch(function (err) {
            alert("Something went wrong :-S\n(Developer, see console for more information.)")
            console.log("Something went wrong :-S " + err);
        })
}

function updateBusList(arr) {
    arr.sort();
    for (i=0; i<arr.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = arr[i].route_short_name;
        document.getElementById("busList").appendChild(option);
        // option.innerHTML = arr[i].route_short_name + " " + arr[i].route_long_name;
    }
}

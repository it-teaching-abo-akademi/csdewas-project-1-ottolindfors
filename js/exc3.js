// Run when DOM has loaded (use "load" to wait till all content has loaded)
document.addEventListener("DOMContentLoaded", function (event) {
    fetchRoutes();
    drawMap();
});

// Add event listener for showRoute button
document.getElementById("showRoute").addEventListener("click", function(){
    showRoute();
});

let map;
const inilat = 60.4545;
const inilon = 22.2648;
const routesUrl = "https://data.foli.fi/gtfs/routes";
const shepesUrlBase = "https://data.foli.fi/gtfs/shapes";

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

function fetchRoutes() {
    /*
    Fetch routes and add them to the drop down
     */
    fetch(routesUrl)
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

function showRoute() {
    /*
    Fetch the shape of the route and draw it on the map
     */
    // TODO: Get url from selected route
    const url = 'https://data.foli.fi/gtfs/v0/20191114-135003/shapes/0_201';
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

function getRouteShapeUrl() {
    //const dts = String(d.getFullYear()) + String(d.getMonth()) + String(d.getSeconds()) + "-" + d.toISOString().substring(11,19).replace(/:/g,"");

}

function getSelectedBus() {
    let busList = document.getElementById("busList");
    return busList.options[busList.selectedIndex].text;  // type=string
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

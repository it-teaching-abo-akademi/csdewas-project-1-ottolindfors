// Run when DOM has loaded (use "load" to wait till all content has loaded)
document.addEventListener("DOMContentLoaded", function (event) {
    fetchRoutes();
    drawMap();
});



let map;
const inilat = 60.4545;
const inilon = 22.2648;
let routeData = [];  // route_short_name, route_long_name, route_id

const routesUrl = "https://data.foli.fi/gtfs/routes";


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

function updateBusList(arr) {
    arr.sort();
    for (i=0; i<arr.length; i++) {
        var option = document.createElement("option");
        option.value = arr[i].route_id;
        option.innerHTML = arr[i].route_short_name + " - " + arr[i].route_long_name;
        document.getElementById("busList").appendChild(option);
        // option.innerHTML = arr[i].route_short_name + " " + arr[i].route_long_name;
    }
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


/*
function getSelectedRouteId() {
    /!*
    Returns the selected route_id from the drop down list.
    The route_id is stored in the value
     *!/
    let busList = document.getElementById("busList");
    return busList.options[busList.selectedIndex].value;  // type=string
}

function showRouteOnMap() {
    /!*
    Fetch the shape of the route and draw it on the map
     *!/
    // TODO: Get url from selected route

    // Acquire route_id
    let route_id = getSelectedRouteId();
    // Acquire list of trips belonging to the route_id from trips.txt
    // Pick the most common shape_id from list of trips
    let shape_id = getShapeIDForRoute(route_id);
    console.log(shape_id);
    // Acquire coordinate listing by shape_id

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

function getShapeIDForRoute(route_id) {
    // Acquire list of trips belonging to the route_id from trips.txt and return shapes of all trips
    // TODO: consider reusing code

    let url = tripsUrlBase + route_id;

    fetch(url)
        .then(function (response) {
            if (response.status >= 200 && response.status < 400) {
                return response.json();
            }
            else {
                alert("Could not fetch trip :-S\n\n(Response status: " + response.status + ")");
                console.log(response.status);
            }
        })
        .then(function (data) {
            let shape_ids = [];
            data.map(fnctInput => shape_ids.push({shape_id: fnctInput.shape_id}));
            console.log(calculateMostCommonShapeID(shape_ids));
            return calculateMostCommonShapeID(shape_ids);
        })
        .catch(function (err) {
            console.log("Something went wrong :-S " + err);
            alert("Something went wrong :-S\n(Developer, see console for more information.)")
        });
}

function calculateMostCommonShapeID(shape_ids) {
    // Calculate most common shape_id in shape_ids_array
    // Currently only picking a random shape_id but will be improved later
    // Also error must be fixed: TypeError: type of shape_ids is undefined
    let rand_idx = Math.floor(Math.random() * shape_ids.length);
    return shape_ids[rand_idx].shape_id;
}
*/




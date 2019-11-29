// Add event listener for showRoute button
document.getElementById("showRoute").addEventListener("click", function(){
    showRoute();
});

var tripsForRouteID;

/*
Get the currently selected route from the drop down.
 */
function getSelectedRoute() {
    let busList = document.getElementById("busList");
    return busList.options[busList.selectedIndex].value;  // type=string
}

/*
Returns a Promise that resolves to a JavaScript object.
This object could be anything that can be represented by JSON — an object, an array, a string, a number...
 */
function handleJSON(response) {
    if (response.status >= 200 && response.status < 400) {
        return response.json();
    }
    else {
        console.log(err);
    }
}

/*
Saves the full data set of trips for a given route_id.
This data is returned by fetchListOfTrips().
 */
function handleTripData(data) {
    tripsForRouteID = data;
}

/*
Returns full data set of trips for a given route_id and saves it to tripsForRouteID.
Example for route_id=1 is at data.foli.fi/gtfs/v0/trips/route/1
 */
function fetchListOfTrips(routeID) {
    let url = "https://data.foli.fi/gtfs/v0//trips/route/" + routeID;
    return fetch(url)
        .then(response => handleJSON(response))
        .then(data => handleTripData(data))
        .catch(err => console.log("Something went wrong :-S " + err))
}

/*
Picks the most common shape_id from list of trips.
Currently only gives a random shape_id (as recommended by Föli).
 */
function getMostCommonShapeId() {
    let randIdx = Math.floor(Math.random() * tripsForRouteID.length);
    return tripsForRouteID[randIdx].shape_id;
}

/*
Draws a shape (route) on the map
 */
function prepCoordsDrawRoute(coordData) {
    let coordinates = coordData.map(coords => ol.proj.fromLonLat([coords.lon, coords.lat]));
    drawBusLine(coordinates);
}

/*
Acquires coordinate listing by shape_id and draws the shape on the map
 */
function fetchShapeCoordinatesAndDraw(shapeID) {
    let url = "http://data.foli.fi/gtfs/shapes/" + shapeID;
    fetch(url)
        .then(response => handleJSON(response))
        .then(data => prepCoordsDrawRoute(data))
        .catch(err => console.log("Something went wrong :-S " + err))
}

async function showRoute() {
    let routeID = getSelectedRoute();
    await fetchListOfTrips(routeID);
    let shapeID = getMostCommonShapeId();
    fetchShapeCoordinatesAndDraw(shapeID);
}


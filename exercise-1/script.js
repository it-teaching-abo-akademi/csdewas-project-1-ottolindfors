function allowDrop(event) {
    event.preventDefault();
}
function drag(event) {
    // Get the id of the image the user drags
    event.dataTransfer.setData("text", event.target.id);
}
function drop(event) {
    event.preventDefault();
    // Get the id of the object the user has begun dragging
    var data = event.dataTransfer.getData("text");
    // Get the object (image) by id and append it (the image) to the target (the place where the image is dropped) in the DOM
    event.target.appendChild(document.getElementById(data))
}
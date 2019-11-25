// Event listener for making input field gray on focus
document.getElementById("barcodeInput").addEventListener("focus", function(){
    document.getElementById("barcodeInput").style.backgroundColor = "lightgray";
});
// Event listener for making input field pink on blur (off focus)
document.getElementById("barcodeInput").addEventListener("blur", function(){
    document.getElementById("barcodeInput").style.backgroundColor = "white";
});

/* Run when DOM has loaded (use "load" to wait till all content has loaded)
document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById("barcodeInput").addEventListener("focus", function(){
        document.getElementById("barcodeInput").style.backgroundColor = "lightgray";
    });
    document.getElementById("barcodeInput").addEventListener("blur", function(){
        document.getElementById("barcodeInput").style.backgroundColor = "pink";
    });
});
*/

// Event listener on the 'Decode' button
document.getElementById("buttonDecode").addEventListener("click", function () {
    const text = document.getElementById("barcodeInput").value;
    try {
        JsBarcode("#barcode", text);
        document.getElementById("errorMessage").innerHTML = "";
        document.getElementById("barcodeInput").style.backgroundColor = "palegreen";
    }
    catch(err) {
        document.getElementById("errorMessage").innerHTML = err.message;
        document.getElementById("barcodeInput").style.backgroundColor = "pink";
    }
});

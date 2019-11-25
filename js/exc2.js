document.getElementById("barcodeInput").addEventListener("focus", function(){
    document.getElementById("barcodeInput").style.backgroundColor = "lightgray";
});
document.getElementById("barcodeInput").addEventListener("blur", function(){
    document.getElementById("barcodeInput").style.backgroundColor = "pink";
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

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

// Event listener for making input field gray on focus
document.getElementById("barcodeInput").addEventListener("focus", function(){
    document.getElementById("barcodeInput").style.backgroundColor = "lightgray";
});

// Event listener for making input field pink on blur (off focus)
document.getElementById("barcodeInput").addEventListener("blur", function(){
    document.getElementById("barcodeInput").style.backgroundColor = "white";
});

// Event listener on the 'Decode' button
document.getElementById("buttonDecode").addEventListener("click", function () {
    const text = document.getElementById("barcodeInput").value;
    try {
        JsBarcode("#barcode", text);
        document.getElementById("errorMessage").innerHTML = "";
        document.getElementById("barcodeInput").style.backgroundColor = "lightgreen";
        decode(text);
    }
    catch(err) {
        document.getElementById("errorMessage").innerHTML = err.message;
        document.getElementById("barcodeInput").style.backgroundColor = "pink";
        updateHTML("", "", "", "");
    }
});

// Event listener for show/hide
document.getElementById("buttonHide").addEventListener("click", function () {
    showHide();
});

function decode(str) {
    // Version: first 1 char
    const version = Number(str[0]);

    // IBAN: next 16 char
    const iban = str.substring(1,17);
    const ibanReadable = iban.substring(0,2)
        + " " + iban.substring(2,6)
        + " " + iban.substring(6,10)
        + " " + iban.substring(10,14)
        + " " + iban.substring(14,16);

    // Amount: euros next 6 char, cents next 2 char
    let euros = str.substring(17, 23).replace(/^0+/, "");
    const cents = str.substring(23,25).replace(/^0+/, "");
    let amount = euros + "," + cents;
    if (euros === "" && cents === "") {
        amount = "none";
    }

    // Reference: next 23 char
    let reference;
    if (version === 4) {
        // Reserve: skip 3 char, Reference: next 20 char
        reference = str.substring(28,48).replace(/^0+/, "");
        /*
        // Add a space at every 5th character from the end. For improved readability
        reference = reference.split("").reverse().join("");  // Reverse
        reference = reference.match(/.{5}/g).join(" ");  // Add space
        reference = reference.split("").reverse().join("");  // Reverse
        */
    }
    if (version === 5) {
        // Check digits: next 2 char
        const checkDigits = "RF" + str.substring(25,27);

        // Reference: next 21 char
        reference = str.substring(27,48).replace(/^0+/, "");

        /*
        // Add a space at every 4th character from the end. For improved readability
        reference = reference.split("").reverse().join("");  // Reverse
        console.log(reference);
        reference = reference.match(/.{4}/g).join(" ");  // Add space
        console.log(reference);
        reference = reference.split("").reverse().join("");  // Reverse
        console.log(reference);
        */

        // Concatenate checkDigits and reference
        reference = checkDigits + " " + reference;
    }

    // Due date. Add a separator between year, mont, day
    let duedate = str.substr(48,54).match(/.{2}/g).join("/");
    if (duedate === "00/00/00") {
        duedate = "none";
    }

    // Update HTML
    updateHTML(ibanReadable, amount, reference, duedate);

}

function updateHTML(iban, amount, reference, dueDate) {
    document.getElementById("iban").innerHTML = iban;
    document.getElementById("amount").innerHTML = amount;
    document.getElementById("reference").innerHTML = reference;
    document.getElementById("duedate").innerHTML = dueDate;
}

function showHide() {
    if (document.getElementById("infoArea").style.visibility === "hidden") {
        document.getElementById("infoArea").style.visibility = "visible";
    }
    else {
        document.getElementById("infoArea").style.visibility = "hidden";
    }
}

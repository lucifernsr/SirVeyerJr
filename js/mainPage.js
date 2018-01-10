// Code for the main app page (Regions List).

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

function viewRegion(regionIndex)
{
    // Save the desired region to local storage so it can be accessed from view region page.
    localStorage.setItem(APP_PREFIX + "-selectedRegion", regionIndex); 
    // ... and load the view region page.
    location.href = 'viewRegion.html';
}

var mainRef = document.getElementById("main");
var regionElementRef = document.getElementById("regionElement");
var lastRef = document.getElementById("last")

// Main page onload function.
function onloadFunctionMainPage() {
    // Get the list of regions from localStorage and modifies the index page.
    var myRegions = JSON.parse(localStorage.getItem("localRegions"));
    
    if (myRegions.length > 0) {
        //createNewCardAndAppend(0);
        for (var counter in myRegions) {
            var thisRegion = JSON.parse(localStorage.getItem(myRegions[counter]));
            createNewCardAndAppend(counter, thisRegion);
        }
        
        // Remove the dummy card.
        mainRef.removeChild(regionElementRef);
    }
}

function createNewCardAndAppend(counter, refRegion) {
    // Create a new card referring the dummy card.
    var newRegionElement = document.importNode(regionElementRef,true);
    // Modify the content of card created.
    var index = Number(counter) + 2;
    newRegionElement.id = `regionElemet${counter}`;
    var childs = newRegionElement.childNodes[3].childNodes;
    childs[1].style.background = `url(images/cardImg0${index}.jpg) center / cover`;
    childs[1].childNodes[1].innerText = refRegion._nickname;
    childs[3].innerText = refRegion._dateAndTime;
    childs[5].childNodes[1].innerText = "View Region";
    childs[5].childNodes[1].setAttribute( "onClick", `javascript: viewRegion(${counter});`);
    
    // Insert the card created.
    mainRef.insertBefore(newRegionElement,lastRef);
}

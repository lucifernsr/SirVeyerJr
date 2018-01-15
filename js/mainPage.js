// Code for the main app page (Regions List).
/*
 * Sir Veyer Jr. TM v2.0
 *
 * MCD4290 - Assignment 02 (2017 T3)
 * 
 * Author(s):   Team 02
 *              Nuwan Sanjeewa, Raidh Ramzee, Randil Silva, Ujitha Hennayake
 *
 * This is the final submission file for the Assignment 02, the surveying app
 * which contains the key functions required to dynamically display the index page
 * with releavent to the Regions saved in the localStorage.
 *
 * This file would only display the Nickname, Date and the Time created in order to 
 * add another layer of abstraction to increase the privacy.
 *
*/
// Global variables used throughout the page.
var mainRef = document.getElementById("main");
var regionElementRef = document.getElementById("regionElement");
var lastRef = document.getElementById("last");

// A simple function used to save the selected region in localStorage for the use in view region page.
function viewRegion(regionIndex) {
    // Save the desired region to local storage so it can be accessed from view region page.
    localStorage.setItem(APP_PREFIX + "-selectedRegion", regionIndex); 
    // ... and load the view region page.
    location.href = 'viewRegion.html';
}

// Main page onload function.
function onloadFunctionMainPage() {
    // Get the list of regions from localStorage and modifies the index page.
    var myRegions = JSON.parse(localStorage.getItem("localRegions"));
    
    if (myRegions !== null) {
        // Checking if there are any regions saved.
        if (myRegions.length > 0) {
            // Dynamically creating mdl card DOM elements for each region saved in localStorage.
            for (var counter in myRegions) {
                var thisRegionPDO = JSON.parse(localStorage.getItem(myRegions[counter]));
                var thisRegion = new Region(thisRegionPDO.name, thisRegionPDO.date, thisRegionPDO.corners);
                createNewCardAndAppend(counter, thisRegion);
            }
            // Remove the dummy card.
            mainRef.removeChild(regionElementRef);
        }
    }
    
}

function createNewCardAndAppend(counter, refRegion) {
    // Create a new card referring the dummy card.
    var newRegionElement = document.importNode(regionElementRef,true);
    
    // Modify the content of card created with the appropriate details.
    var index = Number(counter) + 2;
    newRegionElement.id = `regionElemet${counter}`;
    var childs = newRegionElement.childNodes[3].childNodes;
    childs[1].style.background = `url(images/cardImg0${index}.jpg) center / cover`;
    childs[1].childNodes[1].innerText = refRegion.nickname;
    childs[3].innerText = refRegion.dateAndTime;
    childs[5].childNodes[1].innerText = "View Region";
    childs[5].childNodes[1].setAttribute( "onClick", `javascript: viewRegion(${counter});`);
    
    // Insert the card created.
    mainRef.insertBefore(newRegionElement,lastRef);
}

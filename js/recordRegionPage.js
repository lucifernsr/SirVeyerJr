// Code for the Record Region page.
/*
 * Sir Veyer Jr. TM v2.0
 *
 * MCD4290 - Assignment 02 (2017 T3)
 * 
 * Author(s):   Team 02
 *              Nuwan Sanjeewa, Raidh Ramzee, Randil Silva, Ujitha Hennayake
 *
 * This is the final submission file for the Assignment 02, the surveying app
 * which contains the key functions required to display a interactive map with
 * a updating current location marker and save a region using that.
 *
 * There are many fail-safes included in the app with respect to loccation inaccuracy,
 * insufficient regions when saving or deleting the region, etc.
 *
 * This file has the following functionalities:
 *              # Display the current location in an interactive map.
 *              # Modify the current position with the change of the location accuracy and user movements.
 *              # Display the region as a polygon.
 *              # Modify that polygon with addition of each corner.
 *              # Save a region as a PDO with a Nickname that is easier to keep track of.
*/
// Global variables used throughout the page.
var map, infoWindow, regionInstance, locationInaccuracy, currentPos, regionPolygon;
var corners = [];

// Record region page onload function.
function onloadFunctionRecordRegion() {
    createRegion();
    checkLocalRegions();
}

// A simple function used to obtain a Google LatLng object from the position.
function makeLatLngObj(position) {
    return pos = {   
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
}

// Callback function from the Google API script file.
function initMap() {        
    // Initialise map, centred on UCL, Sri Lanka.        
    map = createMap({lat: 6.9064, lng: 79.9046});
    
    // Initialise a marker to display the current location.
    var currentLocationMarker = new google.maps.Marker({
        position: null,
        icon: {        
            url: 'images/currentLocation.png',
            size: new google.maps.Size(37, 48),
            scaledSize: new google.maps.Size(37, 48) 
        },
        optimized: false,
        map: map      
    });
    
    // Using the pre-defined function to create the polygon object.
    regionPolygon = createPolygon([], '#800080');
    regionPolygon.setMap(map);
    
    // Using HTML5 Geolocation to get the current location/watch for any location changes.
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            // Checking for the location inaccuracy.
            if (position.coords.accuracy < 10) {
                locationInaccuracy = true;
                displayMessage(`Location Accuracy: ${position.coords.accuracy}m`, 1000);
            }
            
            var pos = makeLatLngObj(position);
            currentPos = pos;
            currentLocationMarker.setPosition(pos);
            map.setCenter(pos);
        }, 
                                            function() {
            handleLocationError(true, infoWindow);      
        },
                                           {enableHighAccuracy: true, 
                                            maximumAge        : 8000, 
                                            timeout           : Infinity});
    } 
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter()); 
    }
}

// Location error function.
function handleLocationError(browserHasGeolocation, infoWindow) {
    if (browserHasGeolocation) {
        displayMessage("Please Allow The Location Services", 4000);
    }
    else {
        displayMessage("Your browser doesn't support geolocation.", 1000);
    }
}

// A function for create a new Region instance with an each page load.
function createRegion() {
    regionInstance = new Region("null",getDateAndTimeString(new Date()), []);
}

// A simple function that'd re-center the map to the current location.
function recenter() {
    map.panTo(currentPos);
}

// Add corner function.
function addCorner() {
    // Checking the location inaccuracy.
    if (currentPos !== undefined) {
        //if (locationInaccuracy !== true) {
            regionInstance.cornerLocation = currentPos;
            displayMessage("Corner Added.", 1000);
            regionPolygon.setMap(null);
            regionPolygon.setOptions({paths: regionInstance.cornerLocations});
            regionPolygon.setMap(map);
        /**
        }
        //else {
            displayMessage("Corner saving unsuccesful.");
        } **/
    }
    else {    
        displayMessage("Please wait for the location to be initialized.");
    }
}

// Delete corner function.
function deleteCorner() {
    if (regionInstance.cornerLocations.length > 0) {
        // Prompting a confirmation box to obtain the approval for removing the last point.
        if (confirm('Are you sure you want to remove the last corner added?')) {
            // Using the mutator of the regionInstance object to delete the last corner saved and update the region polygon accordinly.
            regionInstance.deleteThisNumOfCorners = 1;
            displayMessage("Corner Deleted.", 1000);
            regionPolygon.setMap(null);
            regionPolygon.setOptions({paths: regionInstance.cornerLocations});
            regionPolygon.setMap(map);
        }
    }
    // Fail safe if the user haven't added any corners.
    else {
        displayMessage("No corners to remove!");
    }
}

// Reset the complete region.
function resetRegion() {
    if (regionInstance.cornerLocations.length > 0) {
        // Prompting a confirmation box to obtain the approval for clear the region.
        if (confirm('Are you sure you want to reset the region?')) {
            // Using the mutator of the regionInstance object to clear the region and update the region polygon accordinly.
            regionInstance.deleteAllCorners = 1;
            displayMessage("Region Cleared.", 1000);
            regionPolygon.setMap(null);
            regionPolygon.setOptions({paths: regionInstance.cornerLocations});
            regionPolygon.setMap(map);
        }
    }
    // Fail safe if the user haven't added any corners.
    else {
        displayMessage("Empty region!");
    }
    
}

// Save region function.
function saveRegion() {
    // Using set method to remove duplicate point from the corner array.
    corners =  Array.from(new Set(corners));
    for (var point in corners) {
        // Using the mutator of the regionInstance object to insert the corner array.
        regionInstance.cornerLocation = corners[point];
    }
    if (regionInstance.cornerLocations.length > 2) {
        // Getting the current number of regions saved to create the new key.
        var newRegionIndex = JSON.parse(localStorage.getItem("localRegions")).length;
    
        // Updating the Region instance before saving.
        regionInstance.dateAndTime = getDateAndTimeString(new Date());
        regionInstance.nickname = prompt("Set a Nickname for this Region.");
    
        // Saving the Region instance in localStorage using a dynamic key.
        var newKey = `${APP_PREFIX}.Region${newRegionIndex}`;
        var regionPDO = {name: regionInstance.nickname,
                         date: regionInstance.dateAndTime,
                         corners: regionInstance.cornerLocations};
        var newValue = JSON.stringify(regionPDO);
        localStorage.setItem(newKey, newValue);
        modifyLocalRegions(newKey);
    
        // Clear the region instance and initialize the Index page.
        createRegion();
        location.href="index.html"
    }
    
    else {
        // Fail safe if the user haven't added any corners.
        displayMessage("There should be more than two corners in a region.");
    }
}

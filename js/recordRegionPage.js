// Code for the Record Region page.
var map, regionInstance, locationInaccuracy, currentPos, regionPolygon;

// Record region page onload function.
function onloadFunctionRecordRegion() {
    createRegion();
    checkLocalRegions();
}

function makeLatLngObj(position) {
    return pos = {   
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
}

// Map Initialisation callback.  Will be called when Maps API loads.
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
    
    regionPolygon = createPolygon([], '#800080');
    regionPolygon.setMap(map);
    
    // Using HTML5 Geolocation to get the current location/watch for any location changes.
    //var centerBounds = new google.maps.LatLngBounds();
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            // Location inaccuracy.
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

function recenter() {
    map.panTo(currentPos);
}

// Add corner function.
function addCorner() {
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
            if (confirm('Are you sure you want to remove the last corner added?')) {
                regionInstance.deleteThisNumOfCorners = 1;
                displayMessage("Corner Deleted.", 1000);
                regionPolygon.setMap(null);
                regionPolygon.setOptions({paths: regionInstance.cornerLocations});
                regionPolygon.setMap(map);
            }
    }
    else {
        displayMessage("No corners to remove!");
    }
}

// Reset the complete region.
function resetRegion() {
    if (regionInstance.cornerLocations.length > 0) {    
        if (confirm('Are you sure you want to reset the region?')) {
            regionInstance.deleteAllCorners = 1;
            displayMessage("Region Cleared.", 1000);
            regionPolygon.setMap(null);
            regionPolygon.setOptions({paths: regionInstance.cornerLocations});
            regionPolygon.setMap(map);
        }
    }
    else {
        displayMessage("Empty region!");
    }
    
}

// Save region function.
function saveRegion() {
    if (regionInstance.cornerLocations.length > 2) {
        var newRegionIndex = JSON.parse(localStorage.getItem("localRegions")).length;
    
        // Updating the Region instance before saving.
        regionInstance.dateAndTime = getDateAndTimeString(new Date());
        regionInstance.nickname = prompt("Set a Nickname for this Region.");
    
        // Saving the Region instance in localStorage.
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
        displayMessage("There should be more than two corners in a region.");
    }
}

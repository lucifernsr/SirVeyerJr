// Code for the Record Region page.
var map, infoWindow, regionInstance, locationInaccuracy, currentPos, regionPolygon;

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
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 6.9064, lng: 79.9046},
        zoom: 19    
    });
    
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
    
    regionPolygon = new google.maps.Polygon({
        path: [],
        geodesic: true,
        strokeColor: '#800080',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#800080',
        fillOpacity: 0.35
    });
    regionPolygon.setMap(map);
    
    // Using HTML5 Geolocation to get the current location/watch for any location changes.
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
            handleLocationError(true, infoWindow, map.getCenter());      
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
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    if (browserHasGeolocation) {
        displayMessage("Please Allow The Location Services", 4000);
    }
    else {
        displayMessage("Your browser doesn't support geolocation.", 1000);
    }
}

// A function for create a new Region instance with an each page load.
function createRegion() {
    regionInstance = new Region;
}

// Add corner function.
function addCorner() {
    if (locationInaccuracy !== true) {
        regionInstance.addCornerLocation(currentPos);
        displayMessage("Corner Added.", 1000);
        regionPolygon.setMap(null);
        regionPolygon.setOptions({paths: regionInstance.getCornerLocations()});
        regionPolygon.setMap(map);
    }
    else {
        displayMessage("Corner saving unsuccesful.")
    }
}

// Delete corner function.
function deleteCorner() {
    if (regionInstance.getCornerLocations().length > 0) {
            if (confirm('Are you sure you want to remove the last corner added?')) {
            regionInstance.deleteLastCorner();
            displayMessage("Corner Deleted.", 1000);
            regionPolygon.setMap(null);
            regionPolygon.setOptions({paths: regionInstance.getCornerLocations()});
            regionPolygon.setMap(map);
        }
    }
    else {
        displayMessage("No corners to remove!");
    }
}

// Reset the complete region.
function resetRegion() {
    if (regionInstance.getCornerLocations().length > 0) {    
        if (confirm('Are you sure you want to reset the region?')) {
            regionInstance.deleteAllCorners();
            displayMessage("Region Cleared.", 1000);
            regionPolygon.setMap(null);
            regionPolygon.setOptions({paths: regionInstance.getCornerLocations()});
            regionPolygon.setMap(map);
        }
    }
    else {
        displayMessage("Empty region!");
    }
    
}

// Save region function.
function saveRegion() {
    if (regionInstance.getCornerLocations().length > 2) {
        var newRegionIndex = JSON.parse(localStorage.getItem("localRegions")).length;
    
        // Updating the Region instance before saving.
        regionInstance.setDateAndTime(getDateAndTimeString(new Date()));
        regionInstance.setNickname(prompt("Set a Nickname for this Region."));
    
        // Saving the Region instance in localStorage.
        var newKey = `${APP_PREFIX}.Region${newRegionIndex}`;
        var newValue = JSON.stringify(regionInstance);
        localStorage.setItem(newKey,newValue);
        modifyLocalRegions(newKey);
    
        // Clear the saved region and initialize the Index page.
        regionInstance = new Region;
        location.href="index.html"
    }
    else {
        displayMessage("There should be more than two corners in a region.");
    }
}

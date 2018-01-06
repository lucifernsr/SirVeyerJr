// Code for the Record Region page.
var map, infoWindow, regionInstance, currentPos, regionPolygon;

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
                displayMessage(`Location Accuracy: ${position.coords.accuracy}m`)
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
        displayMessage("Your browser doesn't support geolocation.", 4000);
    }
}

// A function for create a new Region instance with an each page load.
function createRegion() {
    regionInstance = new Region;
}

// Add corner function.
function addCorner() {
    regionInstance.addCornerLocation(currentPos);
    displayMessage("Corner Added.", 1000);
    regionPolygon.setMap(null);
    regionPolygon.setOptions({paths: regionInstance.getCornerLocations()});
    regionPolygon.setMap(map);
}

// Delete corner function.
function deleteCorner() {
    console.log("Delete Corner");
}

// Save region function.
function saveRegion() {
    console.log("Save region.");
}

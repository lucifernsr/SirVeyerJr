// Code for the Record Region page.
var map, infoWindow;

// Map Initialisation callback.  Will be called when Maps API loads.
function initMap() {        
    // Initialise map, centred on Melbourne, Australia.        
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 6.9064, lng: 79.9046},
        zoom: 19        
    });
    
    
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                position: pos,
                icon: {
                    url: 'images/currentLocation.png',
                    size: new google.maps.Size(37, 48),
                    scaledSize: new google.maps.Size(37, 48)
                },
                optimized: false,
                map: map
          });
            map.setCenter(pos);
        }, 
                                            function() {
            
            handleLocationError(true, infoWindow, map.getCenter());
        
        },
                                           {enableHighAccuracy: true, 
                                            maximumAge        : 8000, 
                                            timeout           : Infinity});
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter()); 
    }  
}
      
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    if (browserHasGeolocation) {
        displayMessage("Please Allow The Location Services", 4000);
    }
    else {
        displayMessage("Your browser doesn't support geolocation.", 4000);
    }
}

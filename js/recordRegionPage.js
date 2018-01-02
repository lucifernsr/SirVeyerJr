// Code for the Record Region page.

// Map Initialisation callback.  Will be called when Maps API loads.
function initMap() {        
    // Initialise map, centred on Melbourne, Australia.        
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 6.9064, lng: 79.9046},
        zoom: 17        
    });      
}

// Code for the Record Region page.

// Map Initialisation callback.  Will be called when Maps API loads.
function initMap() {        
    // Initialise map, centred on Melbourne, Australia.        
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.8200855, lng: 144.9608045},
        zoom: 17        
    });      
}

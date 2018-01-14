// Code for the View Region page.
var map, regionPolygon, bounds, center, regionInstance;

var fencePostsMarkers = [];

var regionsList = JSON.parse(localStorage.getItem("localRegions"));

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

var regionIndex = localStorage.getItem(APP_PREFIX + "-selectedRegion");
var regionInstancePDO = JSON.parse(localStorage.getItem(`${APP_PREFIX}.Region${regionIndex}`));
//regionInstance.cornerLocation = regionInstance.cornerLocations[0];

var areaRef = document.getElementById("area");
var perimeterRef = document.getElementById("perimeter");

function initMap() {
    regionInstance = new Region(regionInstancePDO.name, regionInstancePDO.date, regionInstancePDO.corners);
    bounds = regionInstance.bounds;
    center = bounds.getCenter();
    fencePosts = regionInstance.boundaryFencePosts;
    
    // Initialise map, centred on the first point of the polygon.        
    map = createMap(center);
    centerOnRegion(bounds, center);
    
    // Initialize the region polygon.
    regionPolygon = regionPolygon = createPolygon(regionInstance.cornerLocations, '#0000FF');
    
    regionPolygon.setMap(map);
    
    // Initialize the markers for fence posts.
    for (var points in fencePosts) {
        var marker = new google.maps.Marker({
    
            position: fencePosts[points],
            title:"Hello World!"
        });
        fencePostsMarkers.push(marker);
    }
}

function onloadFunctionViewRegion() {
    if (regionIndex !== null) {
        // If a region index was specified, show name in header bar title. This
        // is just to demonstrate navigation.  You should set the page header bar
        // title to an appropriate description of the region being displayed.
        document.getElementById("headerBarTitle").textContent = regionInstance.nickname;
        
        areaRef.textContent = regionInstance.area;
        perimeterRef.textContent = regionInstance.perimeter;
    }
}

function togglePosts() {
    for (var item in fencePostsMarkers) {
        fencePostsMarkers[item].setMap(map);
    }
    console.log(regionInstance.boundaryFencePosts);
}

function centerOnRegion(bounds, center) {
    map.setCenter(center);
    map.fitBounds(bounds);
}

function centerButton() {
    centerOnRegion(bounds, center);
}

function deleteRegion() {
}

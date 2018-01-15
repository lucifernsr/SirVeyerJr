// Code for the View Region page.
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
 * releavent to the Region displaying with following functionalities.
 *
 * This file has the following functionalities:
 *              # Display the physical area of a region in an interactive map.
 *              # Display the area of the region in squre meters.
 *              # Display the perimeter of the region in meters.
 *              # Display on/off the suggested fence post locations in the map.
 *              # Delete a region.
*/
// Global variables used throughout the page.
var map, regionPolygon, bounds, center, regionInstance;
var fencePostsMarkers = [];
var postsOn = false;
var regionsList = JSON.parse(localStorage.getItem("localRegions"));
var regionIndex = Number(localStorage.getItem(APP_PREFIX + "-selectedRegion"));
var regionInstancePDO = JSON.parse(localStorage.getItem(`${APP_PREFIX}.Region${regionIndex}`));
var areaRef = document.getElementById("area");
var perimeterRef = document.getElementById("perimeter");

// Callback function from the Google API script file.
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
            icon: {
                url: 'images/fencePost.png',
                size: new google.maps.Size(17, 36),
                scaledSize: new google.maps.Size(17, 36) 
            },
            optimized: false,
            title:"Optimal fence post location"
        });
        fencePostsMarkers.push(marker);
    }
}

// View region onload function.
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

// A simple function to display the fence posts on and off. 
function togglePosts() {
    if (postsOn !== true) {
        for (var item in fencePostsMarkers) {
            fencePostsMarkers[item].setMap(map);
        }
        postsOn = true;
    }
    else {
        for (var item in fencePostsMarkers) {
            fencePostsMarkers[item].setMap(null);
        }
        postsOn = false;
    }
    displayNumOfPostsChip(postsOn, fencePostsMarkers.length);
}

// A simple function to display the Number of fence posts required in a chip.
function displayNumOfPostsChip(postsOn, num) {
    var chipRef = document.getElementById("numOfFencePostsDynamicChip");
    if (postsOn === true) {
        chipRef.innerHTML = `<span class="mdl-chip mdl-chip--contact mdl-shadow--16dp">
                                <span class="mdl-chip__contact mdl-color--orange mdl-color-text--white" style="font-family: 'Pacifico', cursive">
                                    N
                                </span>
                                <span class="mdl-chip__text" style="font-family: 'Dosis', sans-serif">
                                    Number of Fence Posts = ${num}
                                </span>
                            </span>`
    }
    else {
        chipRef.innerHTML = "";
    }
}

// A simple function to center and fit the region to the screen. 
function centerOnRegion(bounds, center) {
    map.setCenter(center);
    map.fitBounds(bounds);
}

// A simple function to call the centerOnRegion() with a button click. 
function centerButton() {
    centerOnRegion(bounds, center);
}

// A simple function to delete a region from the memory with a button click.
function deleteRegion() {
    // Prompting a confirmation box to obtain the approval for removing the last point.
    if (confirm("Are you sure that you want to permanatly delete this region?")) {
        // The method to clear the region if it's the only region.
        if ((regionIndex === 0) && (regionsList.length === 1)) {
            localStorage.clear();
            location.href = 'index.html';
        }
        else {
            // Creating the current and the next region keys dynamically to refer in the next code block.
            var regionKey = `${APP_PREFIX}.Region${regionIndex}`;
            localStorage.removeItem(regionKey);
    
            // Modifing all the remaining elements of the localRegions list.
            for (var j = regionIndex + 1; j <= regionsList.length; j++) {
                var lastKey = `${APP_PREFIX}.Region${j-1}`
                var thisKey = `${APP_PREFIX}.Region${j}`;
                var thisRegionPDO = localStorage.getItem(thisKey);
                localStorage.setItem(lastKey, thisRegionPDO);
            }
            
            // Remove the last 'null' entry from the list and redirecting to the updated index page.
            localStorage.removeItem(`${APP_PREFIX}.Region${regionsList.length}`);
            regionsList.pop();
            localStorage.setItem("localRegions", JSON.stringify(regionsList));
            location.href = 'index.html';
        }
    }
}

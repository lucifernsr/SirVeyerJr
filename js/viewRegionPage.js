// Code for the View Region page.

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

var regionIndex = localStorage.getItem(APP_PREFIX + "-selectedRegion"); 
if (regionIndex !== null)
{
    // If a region index was specified, show name in header bar title. This
    // is just to demonstrate navigation.  You should set the page header bar
    // title to an appropriate description of the region being displayed.
    var regionNames = [ "Region A", "Region B" ];
    document.getElementById("headerBarTitle").textContent = regionNames[regionIndex];
}

// Code for the main app page (Regions List).

// The following is sample code to demonstrate navigation.
// You need not use it for final app.

function viewRegion(regionIndex)
{
    // Save the desired region to local storage so it can be accessed from view region page.
    localStorage.setItem(APP_PREFIX + "-selectedRegion", regionIndex); 
    // ... and load the view region page.
    location.href = 'viewRegion.html';
}

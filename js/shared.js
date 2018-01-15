// Shared code needed by the code of all three pages.
/*
 * Sir Veyer Jr. TM v2.0
 *
 * MCD4290 - Assignment 02 (2017 T3)
 * 
 * Author(s):   Team 02
 *              Nuwan Sanjeewa, Raidh Ramzee, Randil Silva, Ujitha Hennayake
 *
 * This is the final submission file for the Assignment 02, the surveying app
 * which contains the shared functions required to create an object from the 'Region'
 * class with the inputs given and the initializing a map and a polygon which can be
 * accsessed in any script file in the skeleton.
 *
 * This file acts as a place holder for all the key functions and a variables so that
 * it would balance the load in order to minimize the runtime.
 *
*/

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "teamNameUndefined.sirVeyerJr";

function checkLocalRegions() {
    // Array of saved Region objects.
    if (!localStorage.getItem("localRegions")) {
        var savedRegions = JSON.stringify([]);
        localStorage.setItem("localRegions",savedRegions);
    }
}

function modifyLocalRegions(newRegionKey) {
    var myRegions = JSON.parse(localStorage.getItem("localRegions"));
    myRegions.push(newRegionKey);
    localStorage.setItem("localRegions", JSON.stringify(myRegions));
}

// This function displays the given message String as a "toast" message at
// the bottom of the screen.  It will be displayed for 2 second, or if the
// number of milliseconds given by the timeout argument if specified.
function displayMessage(message, timeout)
{
    if (timeout === undefined)
    {
        // Timeout argument not specifed, use default.
        timeout = 2000;
    } 

    if (typeof(message) == 'number')
    {
        // If argument is a number, convert to a string.
        message = message.toString();
    }

    if (typeof(message) != 'string')
    {
        console.log("displayMessage: Argument is not a string.");
        return;
    }

    if (message.length == 0)
    {
        console.log("displayMessage: Given an empty string.");
        return;
    }

    var snackbarContainer = document.getElementById('toast');
    var data = {
        message: message,
        timeout: timeout
    };
    if (snackbarContainer && snackbarContainer.hasOwnProperty("MaterialSnackbar"))
    {
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }
}

// A function to output the Date and the time as a string.
function getDateAndTimeString(dateAndTime) {
    var dateAndTimeString, year, month, date, day, hour, minute, second;
    var dayRef = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var monthRef = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    year = dateAndTime.getFullYear();
    month = dateAndTime.getMonth();
    date = dateAndTime.getDate();
    day = dateAndTime.getDay();
    hour = dateAndTime.getHours();
    minute = dateAndTime.getMinutes();
    second = dateAndTime.getSeconds();
    
    dateAndTimeString = `${hour}:${minute}:${second} ${dayRef[day]}, ${monthRef[month]} ${date}, ${year}`;
    return dateAndTimeString;
}

//
function createMap(thisCenter) {
    return new google.maps.Map(document.getElementById('map'), {
        center: thisCenter,
        zoom: 16    
    });
}

//
function createPolygon(thisPath, thisColor) {
    return new google.maps.Polygon({
        path: thisPath,
        geodesic: true,
        strokeColor: thisColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: thisColor,
        fillOpacity: 0.35
    });
}

// Defining class for a Region instance.
class Region {
    // Defining the constructor variables for the Region class.
    constructor(Nickname, DateAndTime, CornerLocations) {
        // Defining the private attributes of the class.
        this._nickname = Nickname;
        this._dateAndTime = DateAndTime;
        this._cornerLocations = Array.from(new Set(CornerLocations));
        this._fencePostsLocations = [];
        
        // Getting the corner locations and bounds as an instance of Google Maps LatLng class.
        this._cornerLocationsLatLng = [];
        this._bounds = new google.maps.LatLngBounds();
        for (var i in this._cornerLocations) {
            this._cornerLocationsLatLng[i] = new google.maps.LatLng(this._cornerLocations[i]);
            this._bounds.extend(this._cornerLocationsLatLng[i]);
        }
        this._cornerLocationsLatLng.push(this._cornerLocationsLatLng[0]);
    }
    
    // Defining the public methods which can be accessed once a Region instance is created from this class.
    get nickname() {
        return this._nickname;
    };
    get dateAndTime() {
        return this._dateAndTime;
    };
    get cornerLocations() {
        return this._cornerLocations;
    };
    get cornerLocationsLatLng() {
        return this._cornerLocationsLatLng;
    }
    get bounds() {
        return this._bounds;
    }
    
    // Defining the public methods which can be used to modify once a Region instance is created from this class.
    set nickname(Nickname) {
        this._nickname = Nickname;
    };
    set dateAndTime(DateAndTime) {
        this._dateAndTime = DateAndTime;
    };
    set cornerLocation(newLocation) {
        var i = this._cornerLocations.length;
        this._cornerLocations[i] = newLocation;
    };
    set deleteThisNumOfCorners(numOfCorners) {
        for (var i = 0; i< numOfCorners ; i++) {
            this._cornerLocations.pop();
        }
    };
    set deleteAllCorners(numOfCorners) {
        this._cornerLocations = [];
    };
    
    // Defining the public methods which can be used to get the calculated Area and the Perimeter.
    get area() {
        return google.maps.geometry.spherical.computeArea(this._cornerLocationsLatLng).toFixed(4);
    }
    get perimeter() {
        return google.maps.geometry.spherical.computeLength(this._cornerLocationsLatLng).toFixed(4);
    }
    
    // Defining the public method which can be used to get an array of suggested fence post locations.
    get boundaryFencePosts() {
        var test = [];
        for (var k in this._cornerLocationsLatLng) {
            k = Number(k);
            if (this._cornerLocationsLatLng[k] !== this._cornerLocationsLatLng[k+1]) {
                if (k+1 < this._cornerLocationsLatLng.length) {
                    var thisPoint = this._cornerLocationsLatLng[k];
                    var nextPoint = this._cornerLocationsLatLng[k+1];
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(thisPoint,nextPoint).toFixed(4);
                    var maxDistance = 4;
                    if (distance <= maxDistance) {
                        this._fencePostsLocations.push(thisPoint);
                    }
                    else if (distance > maxDistance) {
                        var numOfPosts = Math.floor(distance/maxDistance);
                        var fraction = 1 / numOfPosts;
                        for (var j = 0; j <= 1; j += fraction) {
                            var fitted = google.maps.geometry.spherical.interpolate(thisPoint, nextPoint, j);
                            this._fencePostsLocations.push(fitted);
                        }
                    }
                }
                else {
                    this._fencePostsLocations.push(this._cornerLocationsLatLng[k+1])
                }
            }
        }
        return this._fencePostsLocations;
    }
}

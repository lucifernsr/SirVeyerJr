// Shared code needed by the code of all three pages.

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "teamNameUndefined.sirVeyerJr";

// Array of saved Region objects.
var savedRegions = [];

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

// Defining class for a Region instance.
class Region {
    // Defining the constructor function for the Region class.
    constructor() {
        // Private attributes
        this.nickname = null;;
        this.dateAndTime = new Date();
        this.cornerLocations = [];
    };
    
    // Defining the public methods which can be accessed once an instance is being created from this class.
    getNickname() {
        return this.nickname;
    };
    getDateAndTime() {
        return this.dateAndTime;
    };
    getCornerLocations() {
        return this.cornerLocations;
    };
    
    
    // Defining the public methods which can be used to modify an existing class.
    addCornerLocation(newLocation) {
        var i = this.cornerLocations.length;
        this.cornerLocations[i] = newLocation;
    }
}

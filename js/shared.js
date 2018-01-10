// Shared code needed by the code of all three pages.

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

// Defining class for a Region instance.
class Region {
    // Defining the constructor variables for the Region class.
    constructor() {
        // Private attributes
        this._nickname = null;;
        this._dateAndTime = new Date();
        this._cornerLocations = [];
    }
    
    // Defining the public methods which can be accessed once an instance is being created from this class.
    get nickname() {
        return this._nickname;
    };
    get dateAndTime() {
        return this._dateAndTime;
    };
    get cornerLocations() {
        return this._cornerLocations;
    };
    
    // Defining the public methods which can be used to modify an existing class.
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
}

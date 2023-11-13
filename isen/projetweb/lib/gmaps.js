/*
File        : gmaps.js
Created on  : 
Authors     : Clément DUPLOYEZ / Thomas FOSSATI / Guillaume CATTO
Description : AMD module for the Google Maps API.
*/

define('gmaps', ['async!http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry'],
function () {
    // return the gmaps namespace for brevity
    return window.google.maps;
});
/*
File        : Model.js
Created on  : 
Authors     : Clément DUPLOYEZ / Thomas FOSSATI / Guillaume CATTO
Description : contains the data needed.
*/

define("Model", ["jQuery"], function ($) {
    var Model = function () {
        /* PUBLIC VARIABLES */
        this.onFootDistanceMatrix = [];
        this.polylineDistanceMatrix = [];
        this.onFootDistanceData;
        
        /* METHODS */
        /* getOnFootDistanceMatrix: matrix which contains all the distances on foot from all the markers onto the map */
        this.getOnFootDistanceMatrix = function (map) {
            var i = 0,
                markerPositions = [];
            
            for (i = 0; i < map.markers.length; i++) { //map.markers.length indicates the number of markers to take in account to compute the matrix.
                markerPositions[i] = map.markers[i].position;
            }
            
            map.computeOnFootDistanceMatrix(markerPositions, this);
        };
        
        /* getPolylineDistanceMatrix: matrix which contains all the distances as the crow flies from all the markers onto the map */
        this.getPolylineDistanceMatrix = function (map) {
            var i = 0,
                markerPositions = [];
            
            for (i = 0; i < map.markers.length; i++) { //map.markers.length indicates the number of markers to take in account to compute the matrix.
                markerPositions[i] = map.markers[i].position;
            }
            
            this.polylineDistanceMatrix = map.computePolylineDistanceMatrix(markerPositions.length, this);
        };
   };
    
   return Model;
});
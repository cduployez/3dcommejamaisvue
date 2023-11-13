/*
File        : Map.js
Created on  : 
Authors     : Clément DUPLOYEZ / Thomas FOSSATI / Guillaume CATTO
Description : displays the map on the TBP Solver website.
*/

/*
Variables :
      markers[]                           Liste des marqueurs actuellement placés
      polylines[]                         Liste des polylines actuellement placées
      routes[]                            Liste des routes actuellement placées

Fonctions :
      initialize                          Appelé à la création de la fonction pour créer la map
      Marqueurs :
            setMarker                     Affichage d'un marqueur particulier
            setAllMarkers                 Affichage de tous les marqueurs
            setMarkers                    Affichage de tous les marqueurs, jusqu'à un certain point donné en paramètre
            setAllMap                     Affiche tous les marqueurs sur la carte. Appeler avec null comme paramètre pour effacer
            removeMarker                  Efface le marqueur #id de la carte
            removeMarkers                 Efface les marqueurs de la carte sans les enlever du tableau markers[]
            findMarkerIndex               :3 :3 :3
            showMarkers                   Ne pas utiliser. Affiche tous les marqueurs sur la carte
            deleteMarker                  Efface et supprime du tableau le marqueur #id
            deleteMarkers                 Efface et supprime du tableau
        Lignes :
            addLine                       Traçage d'une ligne entre deux points, place les 2 marqueurs
            deleteAllLines                Supprime toutes les lignes tracées
        Routes :
            addRoute                      Traçage d'une route entre deux points, place les 2 marqueurs
            removeRoutes                  Efface les routes de la carte sans les enlever du tableau routes[]
            deleteRoutes                  Efface et supprime du tableau
        Distances :
            computePolylineDistanceMatrix Calcule toutes les distances entre chaque marqueur, à vol d'oiseau
            computeOnFootDistanceMatrix   Calcule toutes les distances entre chaque marqueur, à pied
            getDistance                   Retourne une distance en la prenant directement dans la matrice, à vol d'oiseau ou à pied

TODO :
        removeLines                       Efface les lignes de la carte sans les enlever du tableau polylines[]
        removeAllMarkers
        removePolyline
        removeRoute
        removeAllPolylines
        removeAllRoutes
        reset
*/

define("Map", ["jQuery", "gmaps"], function ($, g) {
    var Map = function (mapBlock) {
        /* PRIVATE VARIABLES */
        var _self = this,
            _errorDistance = "Non calculée";
        
	$.getJSON('resources/emplacements.txt', function (data) {
            _self.locations = data;

	});
        
        /* METHODS */
        /* initialize: initializes the map */
	this.initialize = function () {
            var position = new g.LatLng(50.62925,3.057256 ); //position de la carte sur lille
            var mapOptions = {
                zoom: 14,
                center: position
            };

            this.map = new g.Map(mapBlock, mapOptions); // nouvelle map
            this.markers = [];
            this.polylines = [];
            this.routes = []; //Contains route names under the forme "id1-id2" with id1 <= id2
            this.onFootComputation = false; //indicates if a onFootDistance Matrix is being computed right now
            // this.makePolylines(this.locations);
            // this.setMarkers(this.locations);
	};
        
        /* Markers *********************************************************** */
        /* setMarker: displays a marker */
	this.setMarker = function (id) { //on récup un objet contenant les objets de chaque emplacement
            for (var i = 0; i < this.markers.length; i++) { //If the marker is already on the map, there's no need to add it again.
                if (id == this.markers[i].Index) { //id et .Index ne sont pas du même type ==> "==" plutôt que "==="
                    //console.log("Marker already placed");
                    return false;
                }
            }
            
            var img = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+ (id) + '|FFAABB|0000FF'; //image pour le curseur + le numéro correspondant
            var myLatLng = new g.LatLng(this.locations[id-1].lat, this.locations[id-1].lng);
            var marker = new g.Marker({
                position: myLatLng,
                map: this.map,
                icon: img,
                title: this.locations[id-1].id,
                Index: this.locations[id-1].id,
                optimized: false //On iOS screens, the icons are blurry because they don't fit Retina display without this option
            });
            
            /* BONUS n°1 Affiche le logo ISEN sur le Marker n°1 */
            if(id === 1){
                marker.icon = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+ (id) + '|0D00FF|FFFFFF';
                
                contentString = '<img src="resources/isen-groupe.jpg">';
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                    });
                google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(this.map,marker);
                });
            }
            
            

            this.markers.push(marker);
            
            return true;
	};
        
        /* setAllMarkers: displays all the markers */
	this.setAllMarkers = function () { //on récup un objet contenant les objets de chaque emplacement
            for (var i = 1; i <= this.locations.length; i++) { //on crée simplement un marqueur pour chaque curseur présent dans l'objet
                this.setMarker(i);
            }
	};
        
        /* setMarkers: displays all the markers until the end-th one */
        this.setMarkers = function (end) { //on récup un objet contenant les objets de chaque emplacement
            if (end < 0) {
                end = 0;
            } else if (end > this.locations.length) {
                end = this.locations.length;
            }
            
            for (var i = 1; i <= end; i++) 
            { //on crée simplement un marqueur pour chaque curseur présent dans l'objet
    	
                this.setMarker(i);
            }
	};
        
        /* setAllMap: sets the map on all markers in the array */
        this.setAllMap = function(map) {
          for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
          }
        };
        
        /* removeMarkers: removes the markers from the map, but keeps them in the array */
        /*this.removeMarkers = function () {
          this.setAllMap(null);
        };*/
        
        /* findMarkerIndex: description */
        this.findMarkerIndex = function (id) {
            var i = 0;
            while (this.markers[i].Index !== id) {
                i++;
            }
            
            if (this.markers[i].Index === id) {
                return i;
            }
            
            return -1;
        };

        /* showMarkers: shows any markers currently in the array */
        this.showMarkers = function () {
          this.setAllMap(this.map);
        };

        /* deleteMarkers: deletes all markers in the array by removing references to them */
        this.deleteMarkers = function () {
          this.setAllMap(null); //this.removeMarkers();
          this.markers = [];
        };
        
        /* deleteMarker: deletes a given marker in the array by removing the reference to it */
        this.deleteMarker = function (id) {
            var i = this.findMarkerIndex(id);
            
            if (i === -1) {
                return false;
            }
            
            if (this.markers[i].Index === id) {
                this.markers[i].setMap(null);
                this.markers.splice(i, 1);
            }
            
            return true;
        };
        /* *********************************************************** */
        
        /* Lines *********************************************************** */
        /* addLine: adds a line on the map between two markers */
	this.addLine = function (id1, id2) {
            if (id1 > id2) {
                return this.addLine(id2,id1);
            }
            
            if (id1 === id2) {
                return false;
            }
            
            if (id1 > this.markers.length || id2 > this.markers.length) //If the marker is not in the list of markers, we can't trace the route
            {
                return false;
            }
            
            var index = id1 + "-" + id2;
            
            for (var i = 0; i < this.polylines.length; i++) {
                if (index === this.polylines[i].index) {
                    //console.log("Polyline already set");
                    return false;
                }
            }
            
            var lines = [];

            /*for (var i = 0; i < locations.length; i++) {
                lines[i] = new g.LatLng(parseFloat(locations[i].lat),parseFloat(locations[i].lng));
            }*/

            lines[0] = new g.LatLng(parseFloat(this.locations[id1-1].lat),parseFloat(this.locations[id1-1].lng));
            lines[1] = new g.LatLng(parseFloat(this.locations[id2-1].lat),parseFloat(this.locations[id2-1].lng));

            var drawLines = new g.Polyline({
                path: lines,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            
            drawLines.index = index;
            
            this.polylines.push(drawLines);

            this.setMarker(id1);
            this.setMarker(id2);
            drawLines.setMap(this.map);
            return true;
	};
        
        /* deleteAllLines: deletes all the lines on the map */
        this.deleteAllLines = function () {
            for (var i = 0; i < this.polylines.length; i++) {
                this.polylines[i].setMap(null);
            }
            this.polylines = [];
        };
        /* *********************************************************** */
        
        /* Routes *********************************************************** */
        /* addRoute: adds a route on the map between two markers */
	this.addRoute = function (id1, id2) {
            
            if (id1 > this.markers.length || id2 > this.markers.length) //If the marker is not in the list of markers, we can't trace the route
            {
                return false;
            }
            
            if (id1 > id2) {
                return this.addRoute(id2,id1); //A pied, pas de différence
            }
            
            var routeName = id1 + "-" + id2;
            
            for (var i = 0; i < this.routes.length; i++) {
                if (routeName === this.routes[i].index) {
                    //console.log("Route already placed");
                    return false;
                }
            }        
            
            var directionsDisplay = new g.DirectionsRenderer({suppressMarkers: true}); //removes "A" and "B" markers with this option
            var directionsService = new g.DirectionsService();
            
            directionsDisplay.index = routeName;
            this.routes.push(directionsDisplay);

            directionsDisplay.setMap(this.map);

            var start = new g.LatLng(parseFloat(this.locations[id1-1].lat),parseFloat(this.locations[id1-1].lng));
            var end = new g.LatLng(parseFloat(this.locations[id2-1].lat),parseFloat(this.locations[id2-1].lng));
            var request = {
                origin:start,
                destination:end,
                travelMode: g.TravelMode.WALKING
            };
            
            directionsService.route(request, function(result, status) 
            {
                if (status === g.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
                }
            });

            this.setMarker(id1);
            this.setMarker(id2);
            
            return true;
	};
        
        /* removeRoutes: description */
        /*this.removeRoutes = function() {
            for (var i = 0; i < this.routes.length; i++) {
                this.routes[i].setMap(null);
            }
        }*/
        
        /* deleteRoute: deletes a given route on the map */
        this.deleteRoute = function (id) {
            this.routes[id].setMap(null);
        };
        
        /* deleteRoutes: deletes all the routes on the map */
        this.deleteRoutes = function () {
            for (var i = 0; i < this.routes.length; i++) { //this.removeRoutes();
                this.routes[i].setMap(null);
            }
            
            this.routes = [];
        };
        /* *********************************************************** */

        /* Distances *********************************************************** */
        /* computePolylineMatrixDistance: computes all the as the crow flies distances between each marker */
        this.computePolylineDistanceMatrix = function (length,model) { //length is the number of markers to compute
                
                
                if (length < 0 || length > this.locations.length) //If the specified length is incorrect, the 30x30 matrix will be computed
                {
                    length = this.locations.length;
                }
                
                var matrix = []; //Variable to retrieve the matrix from localStorage, or to remain empty otherwise
                
                 if (localStorage.getItem("polylineDistanceMatrix") !== null) //If there's already an element stored, maybe there's no need to compute again
                {
                    matrix = JSON.parse(localStorage.getItem("polylineDistanceMatrix")); //Retrieves the matrix from localStorage
                    if (matrix.length >= length) //If the stored matrix is bigger or equal to the requested length (number of markers)
                    {
                        if (length === matrix.length) //If the length of the stored matrix is the same as the requested matrix, no need to cut
                        {
                            return matrix;
                        }
                        else
                        {
                             return this.cutMatrix(matrix,length,length)[0]; //cuts the (too big) matrix to only keep the requested length
                         }
                    }
                }
                
                var computedMatrixLength = matrix.length; //Length of the stored matrix - There's no need to compute the results again for these markers
                var earthRadius = 6365398;
                
		for(var i = computedMatrixLength ; i < length; i++){ //Scan the rows that are not filled yet
                    
                    if (matrix[i] === undefined) //If the row is not declared yet, it needs to be, or matrix[i][j] won't work (undefined[j])
                    {
                        matrix[i] = [];
                    }

                    for(var j = 0; j < length;j++) { //For each row, we must compute will the markers from 0 to length
                                                    //In order to save computation, each symetric column in the matrix will be filled at the same time ([i][j] and [j][i])

                        if (matrix[j] === undefined) //If the row is not declared yet, it needs to be, or matrix[j][i] won't work (undefined[i])
                        {
                            matrix[j] = [];
                        }

                        var latA = this.locations[i].lat * Math.PI / 180 ;
                        var lngA = this.locations[i].lng * Math.PI / 180 ;
                        var latB = this.locations[j].lat * Math.PI / 180 ;
                        var lngB = this.locations[j].lng * Math.PI / 180 ; //passage en radian

                        //calcul précis
                        var distance = 2 * Math.asin( Math.sqrt(  Math.sin((latA-latB)/2)*Math.sin((latA-latB)/2) + Math.cos(latA)*Math.cos(latB)*(Math.sin((lngA-lngB)/2))*(Math.sin((lngA-lngB)/2))));

                        matrix[i][j] = distance * earthRadius;
                        matrix[j][i] = distance * earthRadius; //symetric
                    }
                }
                //The bigger matrix replaces the smaller one in localStorage, for future computation
                localStorage.setItem("polylineDistanceMatrix", JSON.stringify(matrix));
                return matrix;
	};
        
        /* Returns an array containing the source array split into arrays of "max" (max = 10 for Google services) elements max */
        this.splitArray = function(srcArray,max) {
            var tmpArray = []; //stores arrays of length "max"
            var arrays = []; //will store all the tmpArrays
            var i = 0; //number of already stocked "max"-matrices in arrays variable
            
            while (srcArray.length-i*max > max) //Let's split array into "max"-matrices.
            {
                for (var j = 0; j < max; j++) //Fill tmpArray
                {
                    tmpArray[j] = srcArray[j+i*max];
                }
                i++;
                arrays.push(tmpArray);
                tmpArray = []; //clear the tmpArray for next loop
            }
            
            if (srcArray.length-i*max > 0) //There could be less than "max" elements left in the srcArray which were not dealt with.
            {
                for (var j = i*max; j < srcArray.length; j++)
                {
                    tmpArray.push(srcArray[j]);
                }
                arrays.push(tmpArray);
                tmpArray = [];
            }
            return arrays;
        };
        
        /*Function to call Google Distance services and fill the onFootDistanceMatrix*/
        this.callGoogleService = function(origins,destinations,origIndex,destIndex,max,model,alreadyComputedLength) {
            /* origIndex and destIndex represent the current array used in origins/destinations (which may contain multiple arrays)
             * max is the maximum length of an array
             * alreadyComputedLength is the length of matrix already stored in localStorage
             * model contains onFootDistanceMatrix to store the result
             */
            var service = new g.DistanceMatrixService();

            service.getDistanceMatrix({
                origins: origins[origIndex],
                destinations: destinations[destIndex],
                travelMode: g.TravelMode.WALKING,
                unitSystem: g.UnitSystem.METRIC,
                durationInTraffic: false,
                avoidHighways: false,
                avoidTolls: false
            }, function(response, status) { // This anonymous function is the callback called by Google. The sendMatrix function inside will save the distance matrix
                sendMatrix(response, status, model, origIndex, destIndex,max,alreadyComputedLength,false);
            });

            function sendMatrix(response, status, model, origIndex, destIndex,max,alreadyComputedLength,error) {
                var i = 0, j = 0;

                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    console.log("Error. Returned status is: " + status);
                } else {
                    if (origIndex === 0 && destIndex === 0 && alreadyComputedLength === 0) //If we start to compute the matrix from scratch
                    {
                        model.onFootDistanceMatrix = []; // We empty the actual array
                    }
                    model.onFootDistanceData = response;

                    for (i = 0; i < response.rows.length; i++) 
                    {
                        if (model.onFootDistanceMatrix[alreadyComputedLength+i+max*origIndex] === undefined)
                        {
                            /* On first step, if the already stored matrix is of length 5. Then the marker i = 0 will in fact be the 5th marker and will have to be stored in 5+i
                             * On other steps, the marker i = 0 will be 15th marker and 25th marker, so 10*1 and 10*2 (max*origIndex)
                             */
                            
                            //The row "alreadyComputedLength+i+max*origIndex" may not be created yet
                            model.onFootDistanceMatrix[alreadyComputedLength+i+max*origIndex] = [];
                        }
                        var tmp = []; //Temporary array which contains results before stocking them in the matrix

                        for (j = 0; j < response.rows[i].elements.length; j++) 
                        {    
                            if (response.rows[i].elements[j].status === google.maps.DistanceMatrixStatus.OK) {
                                
                                if (model.onFootDistanceMatrix[j+max*destIndex] === undefined)
                                {
                                    //The row symetric row may not be created either
                                    model.onFootDistanceMatrix[j+max*destIndex] = [];
                                }
                                
                                tmp[j] = response.rows[i].elements[j].distance.value; //result
                                //console.log("indices : "+(alreadyComputedLength+i+max*origIndex)+","+(j+max*destIndex));
                                model.onFootDistanceMatrix[alreadyComputedLength+i+max*origIndex][j+max*destIndex] = tmp[j]; //store the result in the matrix..
                                model.onFootDistanceMatrix[j+max*destIndex][alreadyComputedLength+i+max*origIndex] = tmp[j]; //..and symetric coordinates
                            } 
                            else 
                            {
                                tmp[j] = response.rows[i].elements[j].status; //In case of an error, we stock the error
                                model.onFootDistanceMatrix[alreadyComputedLength+i+max*origIndex][j+max*destIndex] = tmp[j];
                                model.onFootDistanceMatrix[i+max*origIndex][alreadyComputedLength+j+max*destIndex] = tmp[j];
                            }
                            tmp = [];
                        }
                    }
                    
                    //The now bigger matrix is stored in localStorage
                    //localStorage.setItem("onFootDistanceMatrix", JSON.stringify(model.onFootDistanceMatrix));
                }
            }
        };
        
        /* computeOnFootDistanceMatrix: computes the on foot distances between each marker requested by the client */
        this.computeOnFootDistanceMatrix = function (markers, model) { 
            
            if (this.onFootComputation) //A matrix is already being computed right now. Computing a new matrix right away will give the error OVER_QUERY_LIMIT
            {
                return;
            }
            
            this.onFootComputation = true; //A matrix is starting to be computed
            
            var alreadyComputedLength = 0; //Variable which will inform about the length of the stored matrix (in localStorage)
            
            if (localStorage.getItem("onFootDistanceMatrix") !== null) //If there's already an element stored, we need to retrieve it and not compute it again
            {
                var computedMatrix = JSON.parse(localStorage.getItem("onFootDistanceMatrix")); //Retrieves the matrix from localStorage
                
                if (computedMatrix.length >= markers.length) //If the requested length is smaller than what's in localStorage, no need to call Google Services
                {
                    if (markers.length === computedMatrix.length) //If the requested length is the same as what's in localStorage, we just return the stored matrix
                    {
                        model.onFootDistanceMatrix = computedMatrix;
                    }
                    else //If the requested length is smaller, the stored matrix needs to be cut to only keep the requested length matrix
                    {
                         model.onFootDistanceMatrix = this.cutMatrix(computedMatrix,markers.length,markers.length)[0];
                    }
                    this.onFootComputation = false;
                    return; //The function needs to be stopped
                }
                else //If the stored matrix is too small, we can still retrieve what has already been computed, so as not to ask Google services for these markers again
                {
                    alreadyComputedLength = computedMatrix.length;
                }
            }
            
            var max = 10; //Maximum number of elements stored in an array to send to google services
            /*
             * 10 respects all the current conditions : Less than 25 elements per array (origins AND destinations)
             *                                          origins.length * destinations.length <= 100
             */

            var notYetComputedMarkers = []; //Contains all the markers which are not already stored in localStorage (origins - localStorage)

            for (var i = alreadyComputedLength; i < markers.length; i++)
            {
                notYetComputedMarkers.push(markers[i]);
            }

            markers = this.splitArray(markers,max);
            notYetComputedMarkers = this.splitArray(notYetComputedMarkers,max);

            //var secondsToWait = 11000; //Seconds to wait to avoid the error OVER_QUERY_LIMIT between 2 requests to Google Services for 10x10 matrices
            var matrixCount = 0; //number of matrices already sent. Handles the time to wait in setTimeout

            var self = this; //In setTimeout, this contains something else
            for (var origIndex = 0; origIndex < markers.length; origIndex++)
            {
                for (var destIndex = 0; destIndex < markers.length; destIndex++)
                {
                    (function (matrixCount,notYetComputedMarkers,markers,origIndex,destIndex,max,self,model,alreadyComputedLength) { //closure for the 11 seconds to be waited between each call to Google services
                        setTimeout(
                            function(){
                                self.callGoogleService(notYetComputedMarkers,markers,origIndex,destIndex,max,model,alreadyComputedLength); //call to Google Services
                                //console.log(matrixCount);
                                if (origIndex === destIndex && origIndex === markers.length - 1) //End of computation (even if there's one call still running)
                                {
                                    console.log("Computation completed");
                                    localStorage.setItem("onFootDistanceMatrix", JSON.stringify(model.onFootDistanceMatrix));
                                    self.onFootComputation = false; //Another matrix can now be computed
;                               }
                            }, 
                            11000*matrixCount);
                    })(matrixCount,notYetComputedMarkers,markers,origIndex,destIndex,max,self,model,alreadyComputedLength);
                    matrixCount++;
                }
            }            
        };
        
        /*Removes everything in localStorage*/
        this.clearCache = function()
        {
            localStorage.clear(); //deletes everything in localStorage
        };
        
        /* cutMatrix: cuts a matrix given with a maxSize */
        this.cutMatrix = function (matrix, maxSizeX, maxSizeY) {
            var matricesArray = [], i = 0, j = 0, k = 0, l = 0, tmpMatrix = [], matrixXLength, matrixYLength, computeOperationNumber, matricesXNumber, matricesYNumber,
            isXSizeMultiple, isYSizeMultiple;
            
            /* Error cases */
            if (matrix === undefined || matrix === null || matrix[0] === undefined) {
                return;
            }
            
            /* If the matrix doesn't need to be cut */
            if (matrix.length <= maxSizeX && matrix[0].length <= maxSizeY) {
                return matrix;
            }
            
            if (maxSizeY === undefined) {
                maxSizeY = maxSizeX;
            }
            
            computeOperationNumber = function (length, maxSize) {
                var modulo, quotient, isMultiple;
                
                modulo = length % maxSize;
                quotient = length / maxSize;
                quotient = quotient | 0; // In order to truncate it

                if (modulo !== 0) {
                    isMultiple = false;
                    return [isMultiple, quotient + 1];
                } else {
                    isMultiple = true;
                    return [isMultiple, quotient];
                }
            };
            
            matrixXLength = matrix.length;
            matrixYLength = matrix[0].length;
            matricesXNumber = computeOperationNumber(matrixXLength, maxSizeX)[1];
            isXSizeMultiple = computeOperationNumber(matrixXLength, maxSizeX)[0];
            matricesYNumber = computeOperationNumber(matrixYLength, maxSizeY)[1];
            isYSizeMultiple = computeOperationNumber(matrixXLength, maxSizeY)[0];
            
            for (i = 0; i < matricesXNumber; i++) {
                for (j = 0; j < matricesYNumber; j++) {
                    var endX = 0, endY = 0;
                    tmpMatrix = []; // The temporary matrix which will be added to the matrices array soon
                    
                    if (i === matricesXNumber - 1 && !isXSizeMultiple) {
                        endX = matrixXLength;
                    } else {
                        endX = (i + 1) * maxSizeX;
                    }
                    
                    for (k = i * maxSizeX; k < endX; k++) {
                        var tmpRow = [], tmpIndex = 0;
                        
                        if (j === matricesYNumber - 1 && !isXSizeMultiple) {
                            endY = matrixYLength;
                        } else {
                            endY = (j + 1) * maxSizeY;
                        }

                        for (l = j * maxSizeY; l < endY; l++) {
                            tmpRow[tmpIndex] = matrix[k][l]; // We copy the matrix inside the new one
                            tmpIndex++;
                        }

                        tmpMatrix.push(tmpRow);
                    }

                    matricesArray.push(tmpMatrix);
                }
            }
            
            return matricesArray;
            
            /*
                The matrices array which will be returned will have matrices in the following order: M1, M2, M3 and M4.
                    _________________________
                    |           |           |
                    |     M1    |     M3    |
                    |           |           |
                    _________________________ => M1 + M2 + M3 + M4 is the matrix given in the parameter
                    |           |           |
                    |     M2    |     M4    |
                    |           |           |
                    _________________________

            */
        };
        
        /* getDistance: returns a distance taken in the right matrix */
        this.getDistance = function (id1, id2, isOnFoot, model) {
            
            var distance = _errorDistance;
            
            if (isOnFoot === undefined) {
                isOnFoot = false;
            }
            
            if (isOnFoot) { // We get the distance computed in the matrix given
                if (model.onFootDistanceMatrix[id1 - 1] !== undefined) { // If the distance is not calculated yet, Distance = -1
                    if (model.onFootDistanceMatrix[id1 - 1][id2 - 1] !== undefined) {
                        distance = model.onFootDistanceMatrix[id1 - 1][id2 - 1];
                    }
                }
            } else {
                if (model.polylineDistanceMatrix[id1 - 1] !== undefined) {
                    if (model.polylineDistanceMatrix[id1 - 1][id2 - 1] !== undefined) {
                        distance = model.polylineDistanceMatrix[id1 - 1][id2 - 1];
                    }
                }
            }
            
            if (!isNaN(distance)) { // If the distance has not been calculated yet, the value will be undefined in the matrix, so we change his value to -1
                distance = Math.round(distance * 100) / 100; // Rounding the number with two decimals, if necessary
            }
            
            return distance;
        };
        /* *********************************************************** */

        /* MAIN */
	this.initialize();
    };

   return Map;
});
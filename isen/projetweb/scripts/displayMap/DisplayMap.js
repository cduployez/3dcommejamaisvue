/*
File        : DisplayMap.js
Created on  : 
Authors     : Clément DUPLOYEZ / Thomas FOSSATI / Guillaume CATTO
Description : displays the map on the TBP Solver website.
*/

/*
 * Variables :
 *      markers[]               Liste des marqueurs actuellement placés
 *      polylines[]             Liste des polylines actuellement placées
 *      routes[]                Liste des routes actuellement placées
 *      
 * Fonctions :
 *      initialize 		Appelé à la création de la fonction pour créer la map
 *      setAllMarkers 		Affichage de tous les marqueurs
 *      setMarker 		Affichage d'un marqueur particulier
 *      addLine                 Traçage d'une ligne entre deux points, place les 2 marqueurs
 *      drawRoute               Traçage d'une route entre deux points, place les 2 marqueurs
 *      removeMarker            Efface le marqueur #id de la carte
 *      removeMarkers           Efface les marqueurs de la carte sans les enlever du tableau markers[]
 *      removeLines             Efface les lignes de la carte sans les enlever du tableau polylines[]
 *      removeRoutes            Efface les routes de la carte sans les enlever du tableau routes[]
 *      deleteRoutes            Efface et supprime du tableau
 *      deleteMarker            Efface et supprime du tableau le marqueur #id
 *      deleteMarkers           Efface et supprime du tableau
 *      setAllMap               Affiche tous les marqueurs sur la carte. Appeler  avec null comme paramètre pour effacer
 *      //showMarkers           Ne pas utiliser. Affiche tous les maruquers sur la carte

    TODO :
            
            removeAllMarkers
            removePolyline
            removeRoute
            removeAllPolylines
            removeAllRoutes
            reset
*/

define("DisplayMap", ["jQuery", "gmaps"], function ($, g) {
    var DisplayMap = function () {
	this.initialize = function()
	{
            var position = new g.LatLng(50.62925,3.057256 ); //position de la carte sur lille
            var mapOptions = {
                zoom: 14,
                center: position
            };

            this.map = new g.Map($('#map-canvas')[0], mapOptions); // nouvelle map
            this.markers = [];
            this.polylines = [];
            this.routes = []; //Ne contient pour l'instant que les noms des routes sous la forme id1-id2
            // this.makePolylines(this.locations);
            // this.setMarkers(this.locations);
	};

	this.setAllMarkers = function() 
	{ //on récup un objet contenant les objets de chaque emplacement
            for (var i = 1; i <= this.locations.length; i++) 
            { //on crée simplement un marqueur pour chaque curseur présent dans l'objet
    	
                this.setMarker(i);
            }
	};

	this.setMarker = function(id) 
	{ //on récup un objet contenant les objets de chaque emplacement
            
            for (var i = 0; i < this.markers.length; i++) //If the marker is already on the map, there's no need to add it again.
            {
                if (id === this.markers[i].Index)
                {
                    //console.log("Marker already placed");
                    return false;
                }
            }
            
            var img = 'https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld='+ (id) + '|FFAABB|0000FF'; //image pour le curseur qu'avait envoyé sous + le numéro correspondant
            var myLatLng = new g.LatLng(this.locations[id-1].lat, this.locations[id-1].lng);
            var marker = new g.Marker(
            {
                position: myLatLng,
                map: this.map,
                icon: img,
                title: this.locations[id-1].id,
                Index: this.locations[id-1].id
            });

            this.markers.push(marker);
            return true;
	};

	this.addLine = function(id1,id2)
	{
            if (id1 > id2)
            {
                return this.addLine(id2,id1);
            }
            
            if (id1 === id2)
            {
                return false;
            }
            
            var index = id1+"-"+id2;
            
            for (var i = 0; i < this.polylines.length; i++)
            {
                if (index === this.polylines[i].index)
                {
                    //console.log("Polyline already set");
                    return false;
                }
            }
            
            var lines = [];

            /*for (var i = 0; i < locations.length; i++)
            {
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
        
        this.deleteLines = function() {
            for (var i = 0; i < this.polylines.length; i++)
            {
                this.polylines[i].setMap(null);
            }
            this.polylines = [];
        };
        
        

	this.addRoute = function(id1,id2)
	{   if (id1 > id2)
            {
                return this.addRoute(id2,id1); //A pied, pas de différence
            }
            
            var routeName = id1+"-"+id2;
            for (var i = 0; i < this.routes.length; i++)
            {
                if (routeName === this.routes[i].index)
                {
                    //console.log("Route already placed");
                    return false;
                }
            }        
            
            
            var directionsDisplay = new g.DirectionsRenderer();
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
        
        /*this.removeRoutes = function()
        {
            for (var i = 0; i < this.routes.length; i++)
            {
                this.routes[i].setMap(null);
            }
        }*/
        
        this.deleteRoutes = function()
        {
            for (var i = 0; i < this.routes.length; i++) //this.removeRoutes();
            {
                this.routes[i].setMap(null);
            }
            this.routes = [];
        };
        
        // Sets the map on all markers in the array.
        this.setAllMap = function(map) {
          for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
          }
        };
        
        // Removes the markers from the map, but keeps them in the array.
        /*this.removeMarkers = function () {
          this.setAllMap(null);
        };*/
        
        this.findMarkerIndex = function (id) 
        {
            var i = 0;
            while (this.markers[i].Index !== id)
            {
                i++;
            }
            
            if (this.markers[i].Index === id)
            {
                return i;
            }
            
            return -1;
        };
        
        //Removes id1-id2 from the map
        /*this.removeMarker = function(id)
        {           
            var i = this.findMarkerIndex(id);
            if (i == -1)
            {
                return false;
            }
            
            if (this.markers[i].Index == id)
            {
                this.markers[i].setMap(null);
            }
            
            return true;
        }*/

        // Shows any markers currently in the array.
        this.showMarkers = function() {
          this.setAllMap(this.map);
        };

        // Deletes all markers in the array by removing references to them.
        this.deleteMarkers = function() {
          this.setAllMap(null); //this.removeMarkers();
          this.markers = [];
        };
        
        this.deleteMarker = function(id)
        {
            var i = this.findMarkerIndex(id);
            if (i === -1)
            {
                return false;
            }
            
            if (this.markers[i].Index === id)
            {
                this.markers[i].setMap(null);
                this.markers.splice(i, 1);
            }
            
            return true;
            
        };
        this.matrixDistancePolyline = function() //affiche toutes les distances à vol d'oiseau (pas finie mais fonctionne)
	{
		
		for(var i = 0 ; i < this.locations.length; i++){
			for(var j = 0; j < this.locations.length;j++){
				
				var latA = this.locations[i].lat * Math.PI / 180 ;
				var lngA = this.locations[i].lng * Math.PI / 180 ;
				var latB = this.locations[j].lat * Math.PI / 180 ;
				var lngB = this.locations[j].lng * Math.PI / 180 ; //passage en radian
				var earthRadius = 6365398;


				//calcul précis
				var distance = 2 * Math.asin( Math.sqrt(  Math.sin((latA-latB)/2)*Math.sin((latA-latB)/2) + Math.cos(latA)*Math.cos(latB)*(Math.sin((lngA-lngB)/2))*(Math.sin((lngA-lngB)/2))));

				console.log(Math.round(distance*earthRadius));
			}
		}	
		
		
	};

	var self = this;
	$.getJSON('scripts/displayMap/files/emplacements.txt',function(data){
		self.locations = data;

	});
	this.initialize();
    };

   return DisplayMap;
});
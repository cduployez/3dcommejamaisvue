/*
File        : Controller.js
Created on  : 
Authors     : Clément DUPLOYEZ / Thomas FOSSATI / Guillaume CATTO
Description : "glue" between the Model and the View.
*/

define("Controller", ["Map", "View", "Model"], function (Map, View, Model) {
    var Controller = function () {
        /* PRIVATE VARIABLES */
        var _self = this,
            _view = new View(),
            _map = new Map(_view.getMapBlock()),
            _model = new Model(),
            _submitButton = _view.getSubmitButton(),
            _displayMatrixButton = _view.getDisplayMatrixButton(),
            _computeDistancesButton = _view.getComputeDistancesButton(),
            _clearCacheButton = _view.getClearCacheButton(),
            _matrixBlock;
        
        /* METHODS */
        /* refreshMap: updates the map with all the informations given by the user in the menu */
        this.refreshMap = function () {
            var n1 = _view.getN1(),
                n2 = _view.getN2(),
                distanceType = _view.getDistanceType(),
                markerNumber = _view.getMarkerNumber();
          
            /* DISTANCE */
            if (markerNumber > 0 && markerNumber !== '') {
                _map.deleteMarkers();
                _map.setMarkers(markerNumber);
                _map.showMarkers();
            } else {
                _map.deleteMarkers();
            }

            /* DISTANCE */
            if (!isNaN(n1) && !isNaN(n2) && n1 > 0 && n2 > 0 && n1 <= _map.locations.length &&  n2 <= _map.locations.length && n1 !== n2) {
                var distance = -1;
                
                if (n1 === n2) {
                    _view.updateDistance(0);
                } else {
                    _map.deleteAllLines();
                    _map.deleteRoutes();

                    if (distanceType === 'as_the_crow_flies') {
                        _map.addLine(n1, n2);
                        distance = _map.getDistance(n1, n2, false, _model);
                    } else if (distanceType === 'on_foot') {
                        _map.addRoute(n1, n2);
                        distance = _map.getDistance(n1, n2, true, _model);
                    }
                    
                    _view.updateDistance(distance);
                }

            } else {
                _view.updateDistance(0);
            }
        };
        
        /* computeDistances: compute all the distances with the distance type given */
        this.computeDistances = function () {
            var distanceType = _view.getDistanceType(),
                markerNumber = _view.getMarkerNumber();
        
            _self.refreshMap();
        
            if (markerNumber > 0 && markerNumber !== '') {
                if (distanceType === 'as_the_crow_flies') {
                    _model.getPolylineDistanceMatrix(_map);
                } else if (distanceType === 'on_foot') {
                    _model.getOnFootDistanceMatrix(_map);
                }
            }
            
            _self.refreshMap();
        };

        /* LISTENERS */
        /* _submitButton: listener on the submit button in the HTML file */
        _submitButton.addEventListener('click', this.refreshMap, false);
        
        /* _computeDistancesButton: listener on the compute distances button in the HTML file */
        _computeDistancesButton.addEventListener('click', this.computeDistances, false);
        
        /* _computeDistancesButton: listener on the compute distances button in the HTML file */
        _computeDistancesButton.addEventListener('click', this.computeDistances, false);
        
        /* _displayMatrixButton: listener on the display matrix button in the HTML file */
        _displayMatrixButton.addEventListener('click', function () {
            var distanceType = _view.getDistanceType();
            
            if (distanceType === 'as_the_crow_flies') {
                _matrixBlock = _model.polylineDistanceMatrix;
            } else {
                _matrixBlock = _model.onFootDistanceMatrix;
            }
            _view.updateMatrix(_matrixBlock);
        }, false);
        
        /* _computeDistancesButton: listener on the compute distances button in the HTML file */
        _clearCacheButton.addEventListener('click', _map.clearCache, false);
   };
    
   return Controller;
});
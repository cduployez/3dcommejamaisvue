/*
File        : View.js
Created on  : 
Authors     : Clément DUPLOYEZ / Thomas FOSSATI / Guillaume CATTO
Description : Object which updates the index.html file.
*/

define("View", ["jQuery"], function ($) {
    var View = function () {
        /* PRIVATE VARIABLES */
        var _self = this,
            _distanceUnit = "mètre",
            _matrixNotEvaluated = "Matrice non calculée",
            _onFootMatrixName = "Matrice (à pied)",
            _polylineMatrixName = "Matrice (à vol d'oiseau)",
            _defaultMatrixName = "Matrice",
            _maxMarker = 30,
            _defaultMarkerNumber = 5;
        
        /* METHODS */
        /* updateDistance: updates the distance regarding the two points selected */
        this.updateDistance = function (distance) {
            var distanceUnit = $('#distance_unit')[0];
            
            $('#update_distance')[0].textContent = distance;
            
            if (!isNaN(distance)) {
                if (Math.abs(distance) > 1) {
                    distanceUnit.textContent = _distanceUnit + 's';
                } else {
                    distanceUnit.textContent = _distanceUnit;
                }
            } else {
                distanceUnit.textContent = '';
            }
        };
        
        /* getDistanceType: returns the distance type selected in the HTML file */
        this.getDistanceType = function () {
            var select = $('#distance_type')[0];
            
            return select.options[select.selectedIndex].value;
        };
        
        /* getMarkerNumber: returns the number of markers requested in the HTML file */
        this.getMarkerNumber = function () {
            var number = $('#marker_number')[0].value;
            
            if (number === 'undefined' || number === '') {
                number = _defaultMarkerNumber;
            }
            
            if (number <= 0) {
                number = 0;
            }
            
            if (number > _maxMarker) {
                number = 30;
            }
            
            $('#marker_number')[0].value = number; // Displays the number evaluated
            
            return number;
        };
        
        /* getMapBlock: returns the map block in the HTML file */
        this.getMapBlock = function () {
            return $('#map-canvas')[0];
        };
        
        /* getN1: returns the n1 number in the HTML file */
        this.getN1 = function () {
            var number = $('#n1')[0].value;
            
            if (number === 'undefined' || number === '') {
                number = 1;
            }
            
            if (number <= 0) {
                number = 0;
            }
            
            if (number > _maxMarker) {
                number = 30;
            }
            
            $('#n1')[0].value = number; // Displays the number evaluated
            
            return number;
        };
        
        /* getN2: returns the n2 number in the HTML file */
        this.getN2 = function () {
            var number = $('#n2')[0].value;
            
            if (number === 'undefined' || number === '') {
                number = 1;
            }
            
            if (number <= 0) {
                number = 0;
            }
            
            if (number > _maxMarker) {
                number = 30;
            }
            
            $('#n2')[0].value = number; // Displays the number evaluated
            
            return number;
        };
        
        /* getSubmitButton: returns the submit button in the HTML file */
        this.getSubmitButton = function () {
            return $('#submit_button')[0];
        };
        
        /* getDisplayMatrixButton: returns the display matrix button in the HTML file */
        this.getDisplayMatrixButton = function () {
            return $('#display_matrix_button')[0];
        };
        
        /* getClearCacheButton: returns the clear cache button in the HTML file */
        this.getClearCacheButton = function () {
            return $('#clear_cache_button')[0];
        };
        
        this.getComputeDistancesButton = function () {
            return $('#compute_distances_button')[0];
        };
        
        /* updateMatrix: updates the polyline/on foot matrix the HTML file, depending which is selected */
        this.updateMatrix = function (matrix) {
            var i = 0, j = 0, matrixBlock, tr, td;
            
            if (matrix[0] !== undefined) { // The distances have been calculated
                matrixBlock = document.createElement("table");
                matrixBlock.className = "matrix";
                tr = document.createElement("tr");

                /* Headers (number of markers) */
                for (j = 0; j <= matrix[0].length; j++) {
                    td = document.createElement("td");
                    td.textContent = j;
                    tr.appendChild(td);
                }

                matrixBlock.appendChild(tr);

                /* Distances */
                for (i = 0; i < matrix.length; i++) {
                    tr = document.createElement("tr");
                    td = document.createElement("td");
                    td.textContent = i + 1;
                    tr.appendChild(td);

                    for (j = 0; j < matrix[i].length; j++) {
                        var distance = matrix[i][j];
                        td = document.createElement("td");
                        td.textContent = Math.round(distance * 100) / 100;
                        tr.appendChild(td);
                    }

                    matrixBlock.appendChild(tr);
                }
                    
            } else { // The distances are not calculated yet, so we only display an error           
                matrixBlock = document.createElement("p");
                matrixBlock.id = "google_maps_error";
                matrixBlock.textContent = _matrixNotEvaluated;
            }
                
            this.createMatrixWindow(matrixBlock);
        };
        
        /* createMatrixWindow: creates the pop-up which will be used to display the matrix */
        this.createMatrixWindow = function (matrixBlock) {
            var distanceType = _self.getDistanceType(), matrixName, matrixWindow/*, width, height, style, deviceWidth, deviceHeight*/;

            if (distanceType === 'as_the_crow_flies') {
                matrixName = _polylineMatrixName;
            } else if (distanceType === 'on_foot') {
                matrixName = _onFootMatrixName;
            } else {
                matrixName = _defaultMatrixName;
            }
            
            matrixWindow = window.open('matrix_window.html');
            
            function loadMatrix(matrixBlock, matrixName) {
                var matrixSection = matrixWindow.document.getElementById('matrix_section'), newMatrix;
                
                matrixWindow.document.title = matrixName;
                newMatrix = matrixBlock.cloneNode(true);
                matrixSection.appendChild(newMatrix);
                matrixSection.addEventListener('mouseover', function () {_self.matrixDisplay(newMatrix); }, false);
            }
            
            matrixWindow.onload = function () {loadMatrix(matrixBlock, matrixName); }; 
        };
        
        /* getOnFootDistanceMatrix: returns the on foot distance matrix in the HTML file */
        this.getOnFootDistanceMatrixBlock = function () {
            return $('#on_foot_distance_matrix')[0];
        };
        
        /* getPolylineDistanceMatrix: returns the polyline distance matrix in the HTML file */
        this.getPolylineDistanceMatrixBlock = function () {
            return $('#as_the_crow_flies_distance_matrix')[0];
        };
        
        /* matrixDisplay: compute all the distances with the distance type given */
        this.matrixDisplay = function (matrixBlock) {
            var tr, td, colorize, getHeaders, previousHeaders = [];
            
            getHeaders = function (td) {
                var tr, tdSibling, elementsToColorize = [], x = 1, i = 1;
                /* x represents the x-th position in the matrix. We start counting from 1 to the last position */
                
                tdSibling = td.previousElementSibling;
                
                /* Getting the x-th position and the left header */
                if (tdSibling === null || tdSibling === undefined) {
                    elementsToColorize.push(td);
                } else {
                    while (tdSibling !== null && tdSibling !== undefined) {
                        if (tdSibling.previousElementSibling === null || tdSibling.previousElementSibling === undefined) {
                            elementsToColorize.push(tdSibling);
                        }

                        x++;
                        tdSibling = tdSibling.previousElementSibling;
                    }
                }
                
                tr = td.parentElement;
                
                /* Getting the top header */
                while (tr !== null && tr !== undefined) { // We start moving up from (1, y) in order to be at (1, 1)
                    if (tr.previousElementSibling === null || tr.previousElementSibling === undefined) { // Here, we are at the position (1, 1)
                        tdSibling = tr.firstChild; // Once we're here, we move to the x-th position in order to get the right td to colorize

                        while (i !== x) { // Getting the right td...
                            tdSibling = tdSibling.nextElementSibling;
                            i++;
                        }

                        elementsToColorize.push(tdSibling); // ... to colorize it
                    }

                    tr = tr.previousElementSibling;
                }
                
                return elementsToColorize;
            };
            
            colorize = function (td, previousHeaders) {
                var elementsToColorize = getHeaders(td);
                
                if (elementsToColorize[0] !== null && elementsToColorize[0] !== undefined) {
                    elementsToColorize[0].className = "table_cursor";
                    
                    if (previousHeaders[0] !== null && previousHeaders[0] !== undefined) {
                        previousHeaders[0].className = "";
                    }
                    
                    previousHeaders[0] = elementsToColorize[0];
                }
                
                if (elementsToColorize[1] !== null && elementsToColorize[1] !== undefined) {
                    elementsToColorize[1].className = "table_cursor";
                    
                    if (previousHeaders[1] !== null && previousHeaders[1] !== undefined) {
                        previousHeaders[1].className = "";
                    }
                    
                    previousHeaders[1] = elementsToColorize[1];
                }
            };
            
            tr = matrixBlock.firstChild;
            
            while (tr !== null && tr !== undefined) {
                td = tr.firstChild;
                
                while (td !== null && td !== undefined) {
                    td.addEventListener('mouseover', function (ev) {colorize(ev.target, previousHeaders);}, false);
                    td = td.nextElementSibling;
                }
                
                tr = tr.nextElementSibling;
            }
        };
   };
    
   return View;
});
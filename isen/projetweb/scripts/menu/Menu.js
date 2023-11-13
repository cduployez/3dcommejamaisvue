/*
File        : Menu.js
Created on  : 
Authors     : Clément DUPLOYEZ / Thomas FOSSATI / Guillaume CATTO
Description : menu script for the TBP Solver website. The menu can be hidden if necessary.
*/

define("Menu", ["jQuery"], function ($) {
    var Menu = function () {
        /* PRIVATE VARIABLES */
        var _menuButton = $('#menu_button')[0], menu = this, _smartphoneWidth = 415;
        
        /* PUBLIC VARIABLES */
        this.isHidden = false; // We can change it without any problem
        
        /* METHODS */
        /* Close: hides the menu */
        this.close = function (width, menu, menuButton, menuLabel, isHidden) {      
            if (width < _smartphoneWidth) {
                menu.style.left = "-" + menu.offsetWidth + "px";
            } else {
                menu.style.left = "-280px";
            }
            
            menuLabel.textContent = "Menu";
            menuLabel.id = "hidden_menu_button_label";

            if (width < _smartphoneWidth) {
                menuButton.style.background = "transparent";
            }
        };
        
        /* Open: shows the menu */
        this.open = function (width, menu, menuButton, menuLabel, isHidden) {
            menu.style.left = "0px";
            menuLabel.textContent = "Cacher";
            menuLabel.id = "visible_menu_button_label";

            if (width < _smartphoneWidth) {
                menuButton.style.background = "rgb(128,114,89)";
            } else {
                menu.style.left = "0px"; 
            }
        };
        
        /* Animation: makes the menu move when you want to hide or show it. Changes this.isHidden. */
        this.animation = (function () {
            var _isHidden = false,
                _menu = $('#menu')[0],
                _menuButton = $('#menu_button')[0];
            
            return function() {
                var _width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
                
                if (_isHidden) {
                   var _menuLabel = $('#hidden_menu_button_label')[0];
                   menu.open(_width, _menu, _menuButton, _menuLabel, _isHidden);
                   _isHidden = false;
                } else {
                    var _menuLabel = $('#visible_menu_button_label')[0];
                    menu.close(_width, _menu, _menuButton, _menuLabel, _isHidden);
                   _isHidden = true;
                   
                   if (_width >= _smartphoneWidth) {
                       _menuButton.style.backgroundColor = "rgb(128,114,89)";
                   }
                }
                
                menu.isHidden = _isHidden;
            };
        })();
        
        /* Resize: makes the menu move when you resize the window. */
        this.resize = function () {
            var _isHidden = false,
                _menu = $('#menu')[0],
                _width = (window.innerWidth > 0) ? window.innerWidth : screen.width,
                _menuButton = $('#menu_button')[0],
                _menuLabel;
            
            if (!menu.isHidden) {
                _menuLabel = $('#visible_menu_button_label')[0];
                
                menu.open(_width, _menu, _menuButton, _menuLabel, _isHidden);
                
                if (_width >= _smartphoneWidth) {
                    _menuButton.style.backgroundColor = "rgb(128,114,89)";
                }
            } else {
                _menuLabel = $('#hidden_menu_button_label')[0];
                
                menu.close(_width, _menu, _menuButton, _menuLabel, _isHidden);
                
                if (_width >= _smartphoneWidth) {
                    _menuButton.style.backgroundColor = "rgb(128,114,89)";
                }
            }
        };
        
        /* LISTENERS */
        /* Menu button: to call the animation method */
        _menuButton.addEventListener('click', this.animation, false);
        /* If the window is resized */
        window.addEventListener('resize', this.resize, false);
   };
    
   return Menu;
});
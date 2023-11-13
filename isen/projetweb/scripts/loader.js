/*
File        : loader.js
Created on  : 
Authors     : Clément DUPLOYEZ / Thomas FOSSATI / Guillaume CATTO
Description : main script with RequireJS.
*/

requirejs.config({
    paths: {
        jQuery: "../lib/jquery-2.1.0.min",
        async: "../lib/async",
        gmaps: "../lib/gmaps",
        Menu: "menu/Menu",
        View: "view/View",
        Model: "model/Model",
        Controller: "controller/Controller",
        Map: "map/Map",
        //DisplayMap: "displayMap/DisplayMap" // C'est votre "test" original, laissé en backup, ah ah :3
    },
    shim: {
        'jQuery': {
            exports: 'jQuery'
        }
    }
});

require(["Controller", "Menu"], init);

function init(Controller, Menu) {
    var c = new Controller(),
            m = new Menu();
}
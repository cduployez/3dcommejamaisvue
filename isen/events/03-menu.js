/*
This simple script allows you to animate a small menu by clicking on the elements.
Try to animate the menu on mouseover and mouseleft to have a fluid navigation.
Furthermore, when you hover an element, other elements must be hidden

You can add CSS to have a better display of the menu
*/

$(document).ready(function() {
    var ligues = $('.ligue > h2');
    var regions = ligues.next().find('p');
    
    ligues.next().hide();
    regions.next().hide();
    
    ligues.click(function(){
        $(this).next().slideToggle();
    });
    
    regions.click(function(){
       $(this).next().slideToggle(); 
    });
});
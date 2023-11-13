function ReverseDisplay(d) {
			/*if(document.getElementById(d).style.display == "none") 
				{ document.getElementById(d).style.display = "block";
				document.getElementById(d+"2").style.display = "none"; }
			else 
				{ document.getElementById(d).style.display = "none";
				document.getElementById(d+"2").style.display = "block"; }*/
			$('#'+d).slideToggle();
}

function reverseTimelineDisplay() {
	$('#timelinepage').slideToggle();
	$('#timelinepage2').slideToggle();
}

$('#showhidetimeline').click(reverseTimelineDisplay);

/*
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
});*/
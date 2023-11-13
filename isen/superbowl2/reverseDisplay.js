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

    var timelineh2 = $("#timelineh2");
    timelineh2 = timelineh2[0];
    
    if (timelineh2.className == "h2closed")
    {
        timelineh2.className = "h2opened";
    }
    else
    {
        timelineh2.className = "h2closed";
    }
	
}

$('#showhidetimeline').click(reverseTimelineDisplay);


function reverseAdminPanel(ev)
{
    if (ev !== undefined)
    {

        var key = String.fromCharCode(ev.keyCode);
        if(ev.ctrlKey && (key == 'z' || key == 'Z'))
        {
            $(".admin").slideToggle();
        }
    }
}

document.addEventListener("keydown",reverseAdminPanel,false);

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
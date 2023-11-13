
visible = false;

function reverseMenuDisplay() {
	var menumobiletitles = $('#menumobiletitles');
	menumobiletitles.slideToggle();

	var menucheck = $("#menumobilemenu")[0];

	console.log(menumobiletitles.is(":visible"));

	if (!visible)
	{
		menucheck.innerHTML = "-> Menu <-";
		visible = true;
	}
	else
	{
		menucheck.innerHTML = "<- Menu ->";
		visible = false;
	}
}

function reverseVisionDisplay() {
	$('.menulinkvision').slideToggle();
}

function reverseCinemaDisplay() {
	$('.menulinkcinema').slideToggle();
}

function reverseAvenirDisplay() {
	$('.menulinkavenir').slideToggle();
}

function ReverseDisplay(id) {
	$("#"+id).slideToggle();
}

document.getElementById('menumobilemenu').addEventListener("click", reverseMenuDisplay, false);
document.getElementById('menulinkvisionlauncher').addEventListener("click", reverseVisionDisplay, false);
document.getElementById('menulinkcinemalauncher').addEventListener("click", reverseCinemaDisplay, false);
document.getElementById('menulinkavenirlauncher').addEventListener("click", reverseAvenirDisplay, false);


document.getElementById('mobilemenulinkvisionlauncher').addEventListener("click", reverseVisionDisplay, false);
document.getElementById('mobilemenulinkcinemalauncher').addEventListener("click", reverseCinemaDisplay, false);
document.getElementById('mobilemenulinkavenirlauncher').addEventListener("click", reverseAvenirDisplay, false);



/**************************/
var RemoveLinks = function(){

	var url = window.location.pathname;
	if (url == "/")
	{
		url = "/index.html";
	}

	url = url.split("/")[1];
	url = url.split(".html")[0];

	var linkToRemove = $("."+url);

	for (var i = 0; i < linkToRemove.length; i++)
	{
		linkToRemove[i].outerHTML = linkToRemove[i].innerHTML;
	}
}();

/**************************/

var links = document.getElementsByTagName("a")
for (var i = 0; i < links.length; i++)
{
	links[i].addEventListener("click", function(ev){ev.stopPropagation();}, false);
};

if (window.location.pathname == "/introduction.html")
{
	jQuery(function() {
    function setAspectRatio() {
      jQuery('iframe').each(function() {
        jQuery(this).css('height', jQuery(this).width() * 9/16);
      });
    }

    setAspectRatio();   
    jQuery(window).resize(setAspectRatio);
	});
}

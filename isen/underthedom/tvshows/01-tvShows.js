/*
In this exercise, you have to 
    1- get the list of TV Shows in an array
    2- order the list by alphabetical ascendant
    3- rewrite the list with <a href="http://followshows.com/show/ + showName"></a> link
    4- Add the show "Falling Skies" in the right place
    5- Bonus: Your script can display the new list using setTimeout for visual effect!

Do it in 2 times:
    1- Without jQuery
    2- With jQuery
*/

//Without jQuery
/*
var listOfTVShows = document.getElementsByTagName("li");
var TVShows = [];
for (var i = 0; i < listOfTVShows.length; i++)
{
	TVShows[i] = listOfTVShows[i].firstChild.nodeValue;
}*/

//With jQuery

var listOfTVShows = $("li");
TVShows = [];
for (var i = 0; i < listOfTVShows.length; i++)
{
	TVShows[i] = listOfTVShows[i].firstChild.nodeValue;
}

var alphaSort = function(tab)
{
	var index = 0;
	var tmp;

	for (var i = 0; i < tab.length; i++)
	{
		for (var j = index; j < tab.length; j++)
			if (tab[i] < tab[j])
			{
				tmp = tab[i];
				tab[i] = tab[j];
				tab[j] = tmp;
			}
	}
	index++;
}

alphaSort(TVShows);

for (var i = 0; i < listOfTVShows.length; i++)
{
	listOfTVShows[i].firstChild.nodeValue = TVShows[i];
	/*var link = document.createElement("a");
	link.setAttribute("href","http://followshows.com/show/"+TVShows[i]);
	listOfTVShows[i].insertBefore(link,listOfTVShows[i].firstChild);
	console.log("done");*/

	var a = document.createElement('a');
	var linkText = document.createTextNode(listOfTVShows[i].firstChild.nodeValue);
	a.appendChild(linkText);
	a.title = "";
	a.href = "http://example.com";
	document.body.appendChild(a);
}
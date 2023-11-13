/*
In this exercise, you have to parse the table in order to create a 2D array.
Then you have to provide functions to order the table by column values...

Do it in 2 times:
    1- Without jQuery
    2- With jQuery
*/



//With jQuery
var tableLines = $("tr");
var tab = [];

for(var i = 1; i < tableLines.length; i++)
{
	tab[i-1] = [];

	var currentElement = tableLines[i].firstElementChild;
	tab[i-1][0] = currentElement.firstChild.nodeValue;

	for (var j = 1; j < tableLines[i].children.length; j++)
	{
		currentElement = currentElement.nextElementSibling;
		tab[i-1][j] = currentElement.firstChild.nodeValue;
	}
}

//jTableLines[1].firstElementChild.firstChild.nodeValue
//jTableLines[2].firstElementChild.nextElementSibling.firstChild.nodeValue

var sortArray = function(tab,column)
{
	var index = 0;
	var tmp;

	for (var i = 0; i < tab.length; i++)
	{
		for (var j = index; j < tab.length; j++)
			if (tab[i][column] < tab[j][column])
			{
				tmp = tab[i];
				tab[i] = tab[j];
				tab[j] = tmp;
			}
	}
	index++;
}



var replace = function(oldtab, newtab)
{
	for (var i = 0; i <= newtab.length; i++)
	{
		for (var j = 0; j < oldtab[i+1].children.length; j++)
		{
			element = oldtab[i+1].firstElementChild;
			for (var k = 0; k < j; k++)
			{
				element = element.nextElementSibling;
			}
			element.firstChild.nodeValue = newtab[i][j];			
		}

	}
}

var alphaSortByColumn = function(tab,column)
{
	sortArray(tab,column);
	replace(tableLines,tab);
}

alphaSortByColumn(tab,4)

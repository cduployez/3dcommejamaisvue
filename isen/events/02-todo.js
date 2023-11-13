var initialize = function()
{
	buttons = document.getElementsByClassName("btn btn-success");
	names = [];
	for (var i = 0; i < buttons.length; i++)
	{
		buttons[i].addEventListener("click",strikeTask,false);
		names[i] = buttons[i].parentNode.parentNode.firstElementChild;
		names[i].addEventListener("click",showInput,false);
	}
	document.head.firstElementChild.innerHTML = "(" + buttons.length + ")" + "Todo List";
}

initialize();
//document.body.addEventListener("keydown", addRow, false);

function addRow()
{

	//Rajouter condition "if ctrlKey + Z"
	array = document.getElementsByTagName('tbody')[0];
	array.innerHTML = array.innerHTML + "<tr>"+
		"<td>"+
		"</td>"+
		"<td>"+
			"<button type='button' class='btn btn-success'>Done</button>"+
		"</td>"+
	"</tr>";
}

function strikeTask()
{
	this.className = "btn btn-danger";
	this.innerHTML = "Remove";

	var text = this.parentNode.parentNode.firstElementChild.innerHTML;
	this.parentNode.parentNode.firstElementChild.innerHTML = "<del>"+text+"</del>";
	this.parentNode.parentNode.firstElementChild.className = "text-muted";
	initialize();
}


function showInput()
{
	var text = this.innerHTML;
	this.innerHTML = "<input type='text' class='form-control' value='" + text + "'>"
	this.removeEventListener("click",showInput,false);
	this.firstElementChild.addEventListener("keypress",enter,false);
}

function enter(ev)
{
	var key = ev.keyCode;
	if (key == 13) //Enter key
	{
		text = this.value;
		this.parentNode.addEventListener("click",showInput,false);
		this.parentNode.innerHTML = text;
		this.removeEventListener("keypress",enter,false);
	}
}
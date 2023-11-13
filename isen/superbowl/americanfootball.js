//Fonction
// Paramètres : Equipe concernée, Action (Touchdown, etc), Complément (passe de tel joueur à tel joueur, ne modifie pas le score)
// Travail en variable globale pour le moment

/*
	Fonction Score(team, action, comment)

	Action :
		- Touchdown 	-> 6 points
		- Safety 		-> 2 points
		- 1pt transfo 	-> 1 point
		- 2pt transfo 	-> 2 points
*/

superbowl = 
{
	location : "Somewhere only we know",
	matchFinished:false,
	matchRunning:false,
	inputNumber : 0,
	team1 : 
		{
		score : 0,
		name : "Hello World",
		label : "team1",
		},

	team2 : 
		{
			score : 0,
			name : "Newbies",
			label : "team2",
		},

	postToTimeline: function(teamId,action,comment)
	{
		var actionBool = true;
		switch(action){
			case "touchdown":
				superbowl.incrementScore(teamId,6);
				break;
			case "safety":
				superbowl.incrementScore(teamId,2);
				break;
			case "1pttransfo":
				superbowl.incrementScore(teamId,1);
				break;
			case "2pttransfo":
				superbowl.incrementScore(teamId,2);
				break;
			default:
				actionBool = false;
				break;
		}

		if (actionBool && (teamId == 1 || teamId == 2))
		{
			if (teamId == 1)
			{
				team1_text = action + " for " + superbowl.team1.name + " - " + comment;
				team2_text = "";				
			};
			if (teamId == 2)
			{
				team2_text = action + " for " + superbowl.team2.name + " - " + comment;
				team1_text = "";				
			};
		}
		else
		{
			team1_text = action + " - " + comment;
			team2_text = action + " - " + comment; 	
		}

		newDiv = document.getElementById('timelinepage');
		newDiv.innerHTML = '<div class="timelinerow">'+
					'<div class="timelineactionleft">'+
						'<!-- Team 1 -->'+
						'<p>'+team1_text+'</p>'+
					'</div>'+
					'<div class="timelinetime">'+
						'<p>'+time.write(time.hours)+':'+time.write(time.minutes)+':'+time.write(time.seconds)+'</p>'+
					'</div>'+

					'<div class="timelineactionright">'+
						'<p>'+team2_text+'</p>'+
					'</div>'+
				'</div>'+
				newDiv.innerHTML;
		return 
	},

	addRow: function(ev)
	{
		var key = String.fromCharCode(ev.keyCode);
		if(ev.ctrlKey && (key == 'z' || key == 'Z'))
		{
			var action = prompt("Action ?");
			var team = prompt("Numero d'equipe (1 ou 2):");
			var comment = prompt("Commentaire ?");
			superbowl.postToTimeline(team,action,comment);
			superbowl.initialiseRowEvents();
		}
	},

	showInput: function()
	{
		var text = this.innerHTML;
		this.innerHTML = "<input type='text' class='showInput' value='" + text + "'>"
		this.removeEventListener("click",superbowl.showInput,false);
		this.firstElementChild.addEventListener("keypress",superbowl.enter,false);
		if (superbowl.inputNumber == 0) document.removeEventListener("keydown", superbowl.addRow, false); //Un ajout de lignes réinitialise les numéros des rows, qui empêche de remodifier à nouveau.
		superbowl.inputNumber++;
	},

	initialiseRowEvents:function()
	{
		rowTeam1 = $(".timelinerow > .timelineactionleft > p");
		rowTeam2 = $(".timelinerow > .timelineactionright > p");

		for (var i = 0; i < rowTeam1.length && i < rowTeam2.length; i++)
		{
			rowTeam1[i].addEventListener("click",superbowl.showInput,false);
			rowTeam2[i].addEventListener("click",superbowl.showInput,false);
		}
	},

	enter: function(ev)
	{
		var key = ev.keyCode;
		if (key == 13) //Enter key
		{
			text = this.value;
			this.parentNode.addEventListener("click",superbowl.showInput,false);
			this.parentNode.innerHTML = text;
			this.removeEventListener("keypress",superbowl.enter,false);
			superbowl.inputNumber--;
			if (superbowl.inputNumber == 0) document.addEventListener("keydown", superbowl.addRow, false);
			document.addEventListener("keydown", superbowl.addRow, false);
		}
	},

	incrementScore : function(teamId,points)
	{
		if (teamId == 1) 
			{
				superbowl.team1.score += points;
				if (superbowl.team1.score < 10 && superbowl.team1.score >= 0)
				{
					score_text = "0"+superbowl.team1.score;
				}
				else
				{
					score_text = superbowl.team1.score;
				}
				id = "scoresuperbowl"+superbowl.team1.label;
				console.log(id);
				document.getElementById(id).innerHTML =score_text;

			}
		if (teamId == 2) 
			{
				superbowl.team2.score += points;
				if (superbowl.team2.score < 10 && superbowl.team2.score >= 0)
				{
					score_text = "0"+superbowl.team2.score;
				}
				else
				{
					score_text = superbowl.team2.score;
				}
				id = "scoresuperbowl"+superbowl.team2.label;
				console.log(id);
				document.getElementById(id).innerHTML =score_text;
			}


	},

	decrementScore : function(teamId,points)
	{
		if (teamId == 1) 
			{
				superbowl.team1.score -= points;
				if (superbowl.team1.score < 10 && superbowl.team1.score >= 0)
				{
					score_text = "0"+superbowl.team1.score;
				}
				else
				{
					score_text = superbowl.team1.score;
				}
				id = "scoresuperbowl"+superbowl.team1.label;
				console.log(id);
				document.getElementById(id).innerHTML =score_text;

			}
		if (teamId == 2) 
			{
				superbowl.team2.score -= points;
				if (superbowl.team2.score < 10 && superbowl.team2.score >= 0)
				{
					score_text = "0"+superbowl.team2.score;
				}
				else
				{
					score_text = superbowl.team2.score;
				}
				id = "scoresuperbowl"+superbowl.team2.label;
				console.log(id);
				document.getElementById(id).innerHTML =score_text;
			}

	},
};

arrayTeam1 = document.getElementsByClassName("nameteam1");
for (var i = 0; i < arrayTeam1.length; i++)
{
	arrayTeam1[i].innerHTML = superbowl.team1.name;
}
arrayTeam2 = document.getElementsByClassName("nameteam2");
for (var i = 0; i < arrayTeam2.length; i++)
{
	arrayTeam2[i].innerHTML = superbowl.team2.name;
}
document.addEventListener("keydown", superbowl.addRow, false);
superbowl.initialiseRowEvents();
/*var rows = [];
var tlRowsNb = document.getElementsByClassName("timelinerow").length
for (var i = 1; i < tlRowsNb; i++)
{
	rows[i] = 
}*/




//superbowl.postToTimeline(superbowl.team1,"touchdown","TOUCHDOOOOOOOOOOOWN");
//console.log(superbowl.team1.score);
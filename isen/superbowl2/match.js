/************************ OBJECTS ************************/

var Team = function(team_name)
{
	this.name = team_name;
	this.score = 0;

	this.quarterScore = [];
	for (var i = 0; i < 4; i++)
	{
		this.quarterScore[i] = 0;
	}

	/*this.halfScore = [];
	for (var i = 0; i < 2; i++)
	{
		this.halfScore[i] = 0;
	}*/

	this.timeoutLeft = 3;
}

var TimelineEvent = function(time,currentQuarter,action,teamId,comment)
{
	// if (action === undefined) --> valeur par défaut //FIXME
	//if(typeof(action) === string)
	this.time = time;
	this.currentQuarter = currentQuarter;
	this.action = action;
	this.teamId = teamId;
	this.comment = comment;
}

var Match = function(date,location,team1_name,team2_name)
{
	/*
		date
		location
		team[0] & team[1]
		timeline[] //this.timeline[0] = new TimelineEvent(...)
		action(teamId,action,comment)
		resfreshTimeline();
		takeTimeout();
		incrementScore(teamId,value)
		decrementScore(teamId,value)
	*/	

	this.date = date;
	this.location = location;
	this.matchRunning = false;
	this.matchFinished = false;
	this.team = [];
	this.team[0] = new Team(team1_name);
	var div = $(".nameteam1");
	for (var i = 0; i < div.length; i++)
	{
		div[i].innerHTML = team1_name;
	}
	this.team[1] = new Team(team2_name);
	div = $(".nameteam2");
	for (var i = 0; i < div.length; i++)
	{
		div[i].innerHTML = team2_name;
	}
	this.timelineSize = -1;
	this.timeline = [];
	//this.timeline[0] = new TimelineEvent;



	this.action = function(teamId,action,comment){
		//Add to timeline
		//Modify timeline --> refreshTimeline()
		//Modify score (total,quarter,half)
		switch(action){
			case "touchdown":
				this.incrementScore(teamId,6);
				break;
			case "safety":
				this.incrementScore(teamId,2);
				break;
			case "1pttransfo":
				this.incrementScore(teamId,1);
				break;
			case "2pttransfo":
				this.incrementScore(teamId,2);
				break;
			case "field goal":
				this.incrementScore(teamId,3);
				break;
			default:
				action = "none";
				break;
		}

		if (teamId != 0 && teamId != 1)
		{
			teamId = 2;
		}

		//TimelineEvent = function(time,currentQuarter,action,teamId,comment)
		this.timeline[this.timeline.length] = new TimelineEvent("00:00:00",chrono.currentQuarter,action,teamId,comment);
		this.refreshTimeline();


		/*newDiv = document.getElementById('timelinepage');
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
				newDiv.innerHTML;*/
		return 
	};

	this.refreshScore = function()
	{
		for (var teamId = 0; teamId < 2; teamId++)
		{
			if (this.team[teamId].score < 10 && this.team[teamId].score >= 0)
			{
				score_text = "0"+this.team[teamId].score;
			}
			else
			{
				score_text = this.team[teamId].score;
			}
			var id = "scoresuperbowlteam"+(teamId+1);
			document.getElementById(id).innerHTML =score_text;
			document.getElementById("trteam"+(teamId+1)).getElementsByClassName("quarter"+chrono.quarter)[0].innerHTML = this.team[teamId].quarterScore[chrono.quarter-1];
		};

		if (this.team[0].quarterScore[chrono.quarter-1] > this.team[1].quarterScore[chrono.quarter-1])
		{
			document.getElementById("trteam1").getElementsByClassName("quarter"+chrono.quarter)[0].className = "quarter"+chrono.quarter+" running winning";
			document.getElementById("trteam2").getElementsByClassName("quarter"+chrono.quarter)[0].className = "quarter"+chrono.quarter+" running";
		}
		if (this.team[0].quarterScore[chrono.quarter-1] < this.team[1].quarterScore[chrono.quarter-1])
		{
			document.getElementById("trteam2").getElementsByClassName("quarter"+chrono.quarter)[0].className = "quarter"+chrono.quarter+" running winning";
			document.getElementById("trteam1").getElementsByClassName("quarter"+chrono.quarter)[0].className = "quarter"+chrono.quarter+" running";
		}
		if (this.team[0].quarterScore[chrono.quarter-1] == this.team[1].quarterScore[chrono.quarter-1])
		{
			document.getElementById("trteam1").getElementsByClassName("quarter"+chrono.quarter)[0].className = "quarter"+chrono.quarter+" running";
			document.getElementById("trteam2").getElementsByClassName("quarter"+chrono.quarter)[0].className = "quarter"+chrono.quarter+" running";
		}

		var teamtd = $(".tdteamname");
		var team1td = teamtd[0];
		var team2td = teamtd[1];

		if(this.team[0].score > this.team[1].score)
		{
			team1td.className = "tdteamname nameteam1 first";
			team2td.className = "tdteamname nameteam2 second";
		}
		if(this.team[1].score > this.team[0].score)
		{
			team1td.className = "tdteamname nameteam1 second";
			team2td.className = "tdteamname nameteam2 first";
		}
		if(this.team[1].score == this.team[0].score)
		{
			team1td.className = "tdteamname nameteam1";
			team2td.className = "tdteamname nameteam2";
		}


	}

	this.incrementScore = function(teamId,points)
	{
		if (teamId == 0 || teamId == 1) 
		{
			this.team[teamId].score += points;
			this.team[teamId].quarterScore[chrono.quarter-1] += points;
			this.refreshScore();
		}
	};

	this.decrementScore = function(teamId,points)
	{
		if (teamId == 0 || teamId == 1) 
		{
			this.team[teamId].score -= points;
			this.team[teamId].quarterScore[chrono.quarter-1] -= points;
			this.refreshScore();
		}
	};

	this.refreshTimeline = function()
	{
		if (this.timelineSize <= 0)
		{
			endPoint = 0;
		}
		else
		{
			endPoint = this.timeline.length-this.timelineSize;
			if (endPoint < 0)
			{
				endPoint = 0;
			}
		}

		var newText = "";

		for (var i = this.timeline.length-1; i >= endPoint; i--)
		{
			var that = this.timeline[i];
			if (that.teamId == 0 || that.teamId == 1)
			{
				if (that.action != "none") //Action + Commentaire pour la team X
				{
					if (that.teamId == 0)
					{
						team1_text = that.action + " for " + this.team[0].name + " - " + that.comment;
						team2_text = "";
					}

					if (that.teamId == 1)
					{
						team2_text = that.action + " for " + this.team[1].name + " - " + that.comment;
						team1_text = "";
					}
				}
				else //Commentaire simple pour la team X
				{
					if (that.teamId == 0)
					{
						team1_text = that.comment;
						team2_text = "";
					}

					if (that.teamId == 1)
					{
						team2_text = that.comment;
						team1_text = "";
					}
				}
			}
			else //Action + Commentaire ou Commentaire simple pour les 2 équipes
			{
				if (that.action != "none") //Action + Commentaire pour team1 et team2
				{
					team1_text = (team2_text = that.action + " - " + that.comment);
				}
				else
				{
					team1_text = (team2_text = that.comment);
				}
			}
			
			newText = newText + '<div class="timelinerow">'+
					'<div class="timelineactionleft">'+
						'<!-- Team 1 -->'+
						'<p>'+team1_text+'</p>'+
					'</div>'+
					'<div class="timelinetime">'+
						'<p>'+chrono.timeString+'</p>'+
					'</div>'+

					'<div class="timelineactionright">'+
						'<p>'+team2_text+'</p>'+
					'</div>'+
				'</div>';
		}
		var newDiv = document.getElementById('timelinepage');
		newDiv.innerHTML = newText;
	};

	this.toggleTimelineSize = function(ev) //Afficher les 5 derniers commentaires, ou bien tous.
	{
		if (match.timelineSize != -1)
		{
			match.timelineSize = -1;
			document.getElementById("toggleTimeline").innerHTML = "-";
		}
		else
		{
			match.timelineSize = 5;
			document.getElementById("toggleTimeline").innerHTML = "+";
		}

		match.refreshTimeline();
		ev.stopPropagation(); //Le bouton qui déclenche la fonction est dans une zone cliquable permettant d'ouvrir/fermer la timeline
	}

	this.takeTimeout = function()
	/*
	// pause chrono, timeoutLeft--. 3 timeouts per half time per team. action(team,null,"team X takes a timeout"
	timeOut is 90 seconds long max --> automaticly restart afterwards
	Check one box.
	*/
	{
		var teamId = -1;
		switch(this.id){
			case "timeout1":
				teamId = 0;
				break;
			case "timeout2":
				teamId = 1;
				break;
			default:
				teamId = -1;
				break;
		}

		if (match.matchRunning && teamId != -1)
		{
			if (match.team[teamId].timeoutLeft > 0)
			{
				chrono.stopChronometer();
				match.team[teamId].timeoutLeft--;
				var timeoutcheckbox = document.getElementsByClassName("check"+(teamId+1)+" marker")[0];
				timeoutcheckbox.className = "check"+(teamId+1)+" markerBlack";
				match.action(teamId,"none",match.team[teamId].name+" takes a timeout");
				var seconds = 0;

				timeoutcheckbox.addEventListener("click",function(){seconds = 89},false);

				myInterval = setInterval((function()
					{
						if (timeoutcheckbox.className == "check"+(teamId+1)+" markerBlack")
						{
							timeoutcheckbox.className = "check"+(teamId+1)+" markerRed";
						}
						else
						{
							timeoutcheckbox.className = "check"+(teamId+1)+" markerBlack";
						}
						seconds++;
						if (seconds == 90) 
							{
								timeoutcheckbox.className = "check"+(teamId+1)+" markerDead";
								clearInterval(myInterval);
								chrono.startChronometer();
							}
					}), 1000);
			}
			else
			{
				console.log("Cette equipe a utilise tous ses timeouts.");
			}
		}
		else
		{
			console.log("Le match n'est pas demarre, ou est stoppe.");
		}

	};
}

match = new Match(Date(),"Somewhere only we know","Hello World","Newbies");

document.getElementById("toggleTimeline").addEventListener("click",match.toggleTimelineSize,false);
var timeoutdiv = $(".timeout");
for (var i = 0; i < timeoutdiv.length; i++)
{
	timeoutdiv[i].addEventListener("click",match.takeTimeout,false);
}


var addToTimeline = function(ev)
{
	var teamId = $("#selectTeam")[0].value;
	var comment = $("#commentInput")[0].value;
	var action = $("#selectAction")[0].value;

	match.action(teamId,action,comment);
	ev.preventDefault();
}

var addButton = $("#submit")[0];
addButton.addEventListener("click",addToTimeline,false);
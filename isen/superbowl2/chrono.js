var checkTimeString = function(time)
{
	if (time < 10)
	{
		return "0"+time;
	}

	return time;
}

var Time = function()
{
	this.hours = 0;
	this.minutes = 0;
	this.seconds = 0;
}

Time.prototype = {
	get hoursString() 
	{
		if (this.hours < 10)
		{
			return "0"+this.hours;
		}
		return this.hours;
	},

	get minutesString() 
	{
		if (this.minutes < 10)
		{
			return "0"+this.minutes;
		}
		return this.minutes;
	},

	get secondsString() 
	{
		if (this.seconds < 10)
		{
			return "0"+this.seconds;
		}
		return this.seconds;
	},
};

var Chronometer = function()
{
	this.quarter = 1;
	this.time = new Time(); //Chronometer Time

	this.chronometer = function()
	{
		this.time.seconds++;
		if (this.time.seconds == 60)
		{
			this.time.seconds = 0;
			this.time.minutes++;
			if (this.time.minutes == 60)
			{
				this.time.hours ++;
			}
		}

		if (this.time.minutes == 15)
		{
			this.stopChronometer();
			this.resetChronometer();
		}

		document.getElementById('ptime').innerHTML = this.timeString;

	};

	this.stopChronometer = function ()
	{
		if (match.matchRunning)
		{
			match.matchRunning = false;
			clearInterval(myInterval);
			document.getElementById('ptime').className = "timepaused";
			document.getElementById('stopChrono').removeEventListener("click",chrono.stopChronometer,false);
			document.getElementById('startChrono').addEventListener("click", chrono.startChronometer, false);
		}
	};

	this.startChronometer = function ()
	{
		if (!match.matchRunning)
		{
			match.matchRunning = true;
			document.getElementById('ptime').className = "";
			myInterval = setInterval((function(){chrono.chronometer()}), 1000);
			document.getElementById('startChrono').removeEventListener("click",chrono.startChronometer,false);
			document.getElementById('stopChrono').addEventListener("click",chrono.stopChronometer,false);
		}
	};

	this.resetChronometer = function ()
	{
		chrono.time.hours = 0;
		chrono.time.minutes = 0;
		chrono.time.seconds = 0;
		document.getElementById('ptime').innerHTML = chrono.timeString;
	};

	this.initEvents = function ()
	{
		document.getElementById('startChrono').addEventListener("click", this.startChronometer, false);
		document.getElementById('resetChrono').addEventListener("click", this.resetChronometer,false);
		var quarters = document.getElementsByClassName('quarters');
		for (var i = 0; i < quarters.length; i++)
		{
			quarters[i].addEventListener("click",this.setQuarter,false);
		}
	};

	this.setQuarter = function()
	{
		if (match.matchRunning)
		{
			var oldQuarterTds = $(".quarter"+chrono.quarter);
			for (var i = 0; i < oldQuarterTds.length; i++)
			{
				oldQuarterTds[i].className = "quarter"+chrono.quarter;
			}
			chrono.quarter = parseInt(this.innerHTML);			
			match.refreshScore();
			chrono.resetChronometer();
		}
	}

	this.initEvents();
}

Chronometer.prototype = {
	get timeString()
	{
		return this.time.hoursString+":"+this.time.minutesString+":"+this.time.secondsString;
	},

	get half()
	{
		if (this.quarter == 1 | this.quarter == 2)
		{
			return 1;
		}
		if (this.quarter == 3 | this.quarter == 4)
		{
			return 2;
		}
		return 0;
	}
}

chrono = new Chronometer();

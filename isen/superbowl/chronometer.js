time = 
{
	seconds : 0,
	minutes : 0,
	hours : 0,
	chronometer : function()
	{
		time.seconds++;
		if (time.seconds == 60)
		{
			time.seconds = 0;
			time.minutes++;
			if (time.minutes == 60)
			{
				time.hours ++;
			}
		}

		if (time.minutes == 15)
		{
			time.stopChronometer();
			time.resetChronometer();
		}

		var hours_text = time.write(time.hours);
		var minutes_text = time.write(time.minutes);
		var seconds_text = time.write(time.seconds);

		document.getElementById('time').innerHTML ="<p>" + hours_text + ":" + minutes_text + ":" + seconds_text + "</p>";
	},

	stopChronometer : function ()
	{
		if (superbowl.matchRunning)
		{
			superbowl.matchRunning = false;
			clearInterval(myInterval);
			this.removeEventListener("click",time.stopChronometer,false);
			document.getElementById('startChrono').addEventListener("click", time.startChronometer, false);
		}
	},

	startChronometer : function ()
	{
		if (!superbowl.matchRunning)
		{
			superbowl.matchRunning = true;
			myInterval = setInterval((function(){time.chronometer()}), 1000);
			this.removeEventListener("click",time.startChronometer,false);
			document.getElementById('stopChrono').addEventListener("click",time.stopChronometer,false);
		}
	},

	resetChronometer : function ()
	{
		time.hours = 0;
		time.minutes = 0;
		time.seconds = 0;
		document.getElementById('time').innerHTML ="<p>00:00:00</p>";
	},

	write: function(time)
	{
		if (time < 10)
		{
			return "0" + time;
		}
		else
		{
			return time;
		}
	}
};

//Events
document.getElementById('startChrono').addEventListener("click", time.startChronometer, false);
document.getElementById('resetChrono').addEventListener("click", time.resetChronometer,false);
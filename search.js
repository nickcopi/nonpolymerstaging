

/*Given a string and an object finds instances of that string in the object and retuns a new object yeah*/
let search = (text,obj)=>{
	text = text.toLowerCase();
	let matchingIndexes = [];
	let results = [];
	let objKeys = Object.keys(obj);
	for(x in obj){
		obj[x].forEach((value,i)=>{
		if(String(value).toLowerCase().indexOf(text) !== -1)
			matchingIndexes.push(i);
		});
	}
	matchingIndexes.forEach((index)=>{
		let newObj = {};
		objKeys.forEach(key=>{
			newObj[key] = obj[key][index]
		});
		results.push(newObj);
	});
	return results;
}
let drawResults = results=>{
	let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	let date = new Date;
	let today = days[date.getDay()];
	let now = decimalizeTime(String(date.getHours()) + String(date.getMinutes()));
	results.forEach((result)=>{
		info = "<h1>Found:</h1>";
		let beginTimes = [];
		let meetDays = [];
		let rooms = [];
		let buildings = [];
		for(x in result){
			if(result[x] === null)
				continue;
			let beginTimeIndex = x.indexOf('BEGIN_TIME');
			let meetDayIndex = x.indexOf('MEETING_DAYS');
			let roomIndex = x.indexOf('ROOM');
			let buildingIndex = x.indexOf('BUILDING');
			if(beginTimeIndex !== -1){
				beginTimes[Number(x.substr(beginTimeIndex+10,x.length))-1] = result[x];
				output = parseTime(result[x]);
			}
			else if(meetDayIndex !== -1){
				meetDays[Number(x.substr(meetDayIndex+12,x.length))-1] = meetDayParse(result[x]);
				output = meetDayParse(result[x]);
			}
			else if(roomIndex !== -1){
				console.log(x.substr(meetDayIndex+5,x.length));
				rooms[Number(x.substr(meetDayIndex+5,x.length))-1] = result[x];
				output = result[x];
			}
			else if(buildingIndex !== -1){
				buildings[Number(x.substr(buildingIndex+8,x.length))-1] = result[x];
				output = result[x];
			}
			else
				output = result[x];
			info += `${x}: ${output}<br>`;
		}
		let indexsOfToday =  [];
		meetDays.forEach((meetDay,i)=>{
			if(meetDay.indexOf(today) !== -1)
				indexsOfToday.push(i);
		});
		indexsOfToday.forEach(index=>{
			info += `Meeting today at ${beginTimes[index]}!`;
			let timeStart = decimalizeTime(beginTimes[index]);
			if(timeStart <= now && timeStart + 1.25 >= now){
				info += '<h1 style="color:red">THERES A CLASS RIGHT NOW!!!!</h1>';
			}
		});
		console.log(beginTimes,meetDays,rooms,buildings);
		let element = newResult();
		element.innerHTML = info;
	});
};


/*take in hhmm return hh.(mm/60)*/
let decimalizeTime = time=>{
	let hours = Number(time.substr(0,2));
	hours += Number(time.substr(2,4)) / 60;
	return hours;


};

/*Take time in hhmm format and return a hh:mm [am/pm] format*/
let parseTime = time=>{
	let newTime = [];
	let pm = false;
	newTime.push(time.substr(0,2));
	newTime.push(time.substr(2,4));
	if(newTime[0] > 12){
		newTime[0] -= 12;
		pm = true;
	}
	if(newTime[0] == 12) pm = true;
	if(newTime[0] == 0) newTime[0] = 12;
	return newTime.join(':') +(pm?' pm':' am');

}
/*Take in unformated day of the week string and return a comma seperated list of days of the week*/
let meetDayParse = day=>{
	let trIndex = day.indexOf('TR');
	let meetingDays = [];
	if(trIndex !== -1){
		day = day.substr(0,trIndex) + day.substr(trIndex+2,day.length);
		meetingDays.push('Thursday');
	}
	if(day.indexOf('M') !== -1) meetingDays.push('Monday');
	if(day.indexOf('T') !== -1) meetingDays.push('Tuesday');
	if(day.indexOf('W') !== -1) meetingDays.push('Wednesday');
	if(day.indexOf('R') !== -1) meetingDays.push('Thursday');
	if(day.indexOf('F') !== -1) meetingDays.push('Friday');
	if(day.indexOf('S') !== -1) meetingDays.push('Saturday');
	if(day.indexOf('U') !== -1) meetingDays.push('Sunday');
	return meetingDays.join();
}

let newResult = ()=>{
	let result = document.createElement('div');
	result.className = 'result';
	document.getElementById('results').appendChild(result);
	return result;

}

/*Run when key is pressed in search box, runs search and then displays results*/
function onSearch(e){
	if(e.keyCode !== 13) return;
	document.getElementById('graphs').style.display = 'none';
	document.getElementById('results').style.display = 'block';
	document.getElementById('results').innerHTML = '';
	drawResults(search(this.value,dump));
	this.value = '';



}

function main() {
	var title = getParameterByName('title');
	var totime = getParameterByName('time');

	if (!title || !totime) {
		createnew();
	} else {
		countdown(title, totime);
	}
}

function createnew() {
	document.getElementById('countdownwrap').style.display = "none";
	document.getElementById('createnewwrap').style.display = "block";
}

function updatenew() {
	var urltitle = document.getElementById('intitle').value;
	if (urltitle == "") {
		document.getElementById('newresult_btn').disabled = true;
		document.getElementById('newresult').value = "";
		return;
	}
	var seltime = moment($('#intime').data("DateTimePicker").date());
	if (!seltime.isValid()) {
		document.getElementById('newresult_btn').disabled = true;
		document.getElementById('newresult').value = "";
		return;
	}
	var urltime = seltime.format("YYYY")+"Y"+seltime.format("MM")+"M"+seltime.format("DD")+"D"+seltime.format("HH")+"h"+seltime.format("mm")+"m"+seltime.format("ss")+"s";
	var urlfinal = location + "?time=" + encodeURIComponent(urltime) + "&title=" + encodeURIComponent(urltitle);
	document.getElementById('newresult').value = urlfinal;
	document.getElementById('newresult_btn').disabled = false;
}

function countdown(title, totime) {
	document.getElementById('countdownwrap').style.display = "block";
	document.getElementById('createnewwrap').style.display = "none";
	document.getElementById('sharelink').value = location;
	var ptotime = parseTime(totime);
	if (!ptotime) {
		createnew();
		return;
	}
	var totime_year = ptotime[1];
	var totime_month = ptotime[2];
	var totime_day = ptotime[3];
	var totime_hour = ptotime[4];
	var totime_minute = ptotime[5];
	if (ptotime.length == 6) {
		var totime_second = 0;
		var totime_timezone = moment().utcOffset();
	} else if (ptotime.length == 7) {
		if (ptotime[6][0] == "p" || ptotime[6][0] == "n" || ptotime[6][0] == "Z") {
			var totime_second = 0;
			var totime_timezone = ptotime[6];
		} else {
			var totime_second = ptotime[6];
			var totime_timezone = moment().utcOffset();
		}
	} else if (ptotime.length == 8) {
		var totime_second = ptotime[6];
		var totime_timezone = ptotime[7];
	}
	var regex = new RegExp(/([pn])([0-2]\d)([0-5]\d)|(Z)/);
	var tmp = regex.exec(totime_timezone);
	if (tmp) {
		tmp = cleanArray(tmp);
		if (tmp[1] == 'Z') {
			totime_timezone = 0;
		} else if (tmp[1] == 'p') {
			totime_timezone = parseInt(tmp[2]) * 60 + parseInt(tmp[3]);
		} else if (tmp[1] == 'n') {
			totime_timezone = (parseInt(tmp[2]) * 60 + parseInt(tmp[3])) * (-1);
		}
	}

	document.getElementById('title').innerHTML = title;
	document.getElementById('totime_year').innerHTML = pad(totime_year,4);
	document.getElementById('totime_month').innerHTML = pad(totime_month,2);
	document.getElementById('totime_day').innerHTML = pad(totime_day,2);
	document.getElementById('totime_hour').innerHTML = pad(totime_hour,2);
	document.getElementById('totime_minute').innerHTML = pad(totime_minute,2);
	document.getElementById('totime_second').innerHTML = pad(totime_second,2);

	var theTime = new Date(toISOtime(totime_year, totime_month, totime_day, totime_hour, totime_minute, totime_second, totime_timezone));

	setInterval(function () {
		if (moment(theTime).isAfter(moment())) {
			var cd = moment.duration(moment(theTime).diff(moment()));
			var passed = false;
		} else {
			var cd = moment.duration(moment().diff(theTime));
			var passed = true;
		}
		if (passed) {
			document.getElementById('passed').style.display = "block";
		} else {
			document.getElementById('passed').style.display = "none";
		}
		document.getElementById('nowtime_year').innerHTML = moment().format('YYYY');
		document.getElementById('nowtime_month').innerHTML = moment().format('MM');
		document.getElementById('nowtime_day').innerHTML = moment().format('DD');
		document.getElementById('nowtime_hour').innerHTML = moment().format('HH');
		document.getElementById('nowtime_minute').innerHTML = moment().format('mm');
		document.getElementById('nowtime_second').innerHTML = moment().format('ss');
		document.getElementById('countdown_year').innerHTML = pad(cd.years(),4);
		document.getElementById('countdown_month').innerHTML = pad(cd.months(),2);
		document.getElementById('countdown_day').innerHTML = pad(cd.days(),2);
		document.getElementById('countdown_hour').innerHTML = pad(cd.hours(),2);
		document.getElementById('countdown_minute').innerHTML = pad(cd.minutes(),2);
		document.getElementById('countdown_second').innerHTML = pad(cd.seconds(),2);
	}, 1000);
}

function toISOtime(year, month, day, hour, minute, second, timezone) {
	var tzh = (timezone < 0) ? Math.ceil(timezone / 60) : Math.floor(timezone / 60);
	var tzm = timezone - (tzh * 60);
	if (tzh < 0) {
		var tz = "-"+pad(tzh*(-1),2)+":"+pad(tzm,2);
	} else {
		var tz = "+"+pad(tzh,2)+":"+pad(tzm,2);
	}
	return pad(year,4)+"-"+pad(month,2)+"-"+pad(day,2)+"T"+pad(hour,2)+":"+pad(minute,2)+":"+pad(second,2)+tz;
}

function pad(n, width, z) {
	z = z || '0';	//padding with zero or other symbol
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function cleanArray(actual){
	var newArray = new Array();
	for(var i = 0; i<actual.length; i++){
		if (actual[i]){
			newArray.push(actual[i]);
		}
	}
	return newArray;
}

function parseTime(time) {
	var regex = new RegExp(/(\d{4})Y([01]*\d)M([0-3]*\d)D([0-2]*\d)h([0-5]*\d)m([0-5]*\d)s([pn][0-2]\d[0-5]\d|Z)*|(\d{4})Y([01]*\d)M([0-3]*\d)D([0-2]*\d)h([0-5]*\d)m([pn][0-2]\d[0-5]\d|Z)*/);
	rst = cleanArray(regex.exec(time));
	return (rst)?rst:null;
}

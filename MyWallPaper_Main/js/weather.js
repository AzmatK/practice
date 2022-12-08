
/******** Show weather Information ******/
var locationDetails;
(function(){

var geoStored = {};///

function get_woeid(coords, callback) {
	//call to yahoo api to get current location woeid
	var url = "https://query.yahooapis.com/v1/public/yql?q=select%20woeid%20from%20geo.places%20where%20text%3D%22(" + coords.latitude + "," + coords.longitude + ")%22%20limit%201&diagnostics=false";
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var xmlDoc = this.responseXML;
			var x = (xmlDoc.getElementsByTagName("woeid")[0]).textContent;
			callback(x);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();	
}

function save_coordinates(geo) {
	geoStored.loc_longitude = geo.coords.longitude;
	geoStored.loc_latitude  = geo.coords.latitude;
	// get_woeid(geo.coords, function (woeid) {
	// 	geoStored.loc_woeid = woeid;
	// 	localStorage.setItem('loc_woeid',woeid);
	// 	refresh_weather();
	// });
}

function permission_error() {
	console.log("Can't display weather information without Location permission.");
}

function refresh_weather() {
	//call to yahoo apis to get weather details using woeid captured
	var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(" + geoStored.loc_woeid + ")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	//console.log(url);
	getJSON(url, function (response) { 
		if(response.query.count > 0){	
			locationDetails = response.query.results.channel;
			var item = response.query.results.channel.item;			
			var city = response.query.results.channel.location.city;
			//show city name and temperature
			$('#weather-panel-fahrenheit > #city-temperature > span').text(city + ' ' + item.condition.temp);
			$('#weather-panel-celcius > #city-temperature > span').text(city + ' ' + Math.round((item.condition.temp-32)*5/9));
			//show only if present, bydefault display-none
			$("#weather").css('display', 'inline-block');
			//Bydefault hide celcius value
			$("#weather-panel-celcius").hide();
			//show climate icon accordingly
			var selectedImage = 'clearday.png';
			if(item.condition.text.includes('Cloudy')){
				selectedImage = 'partlyCloudy.png';
			}
			else if(item.condition.text.includes('Thunderstorms')){
				selectedImage = 'thunderStorms.png';
			}
			document.getElementById('weather-type').innerHTML = '<img src=../img/weather/'+selectedImage+' title="' + item.condition.text +'"/>';
		}
	});
}

function getJSON(url, callback) {
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.onerror = function() {
	  console.log("an error occurred");
	};
	req.onload = function() {
	  if (this.status == 200) {
	    callback(JSON.parse(this.responseText))
	  } 
	};
	req.send(null);
}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(save_coordinates, permission_error);
}

})();

//Switch temperature degree
$("#weather").click(function(){
	$("#weather-panel-fahrenheit").toggle();
	$("#weather-panel-celcius").toggle();
})
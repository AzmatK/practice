
/****** Default settings of search page *******/

//default settings json to be saved in local storage
var default_settings = {
  time_format:        '12',
  wallpaper_image:    '../img/backgrounds/03.jpg',
  wallpaper_style:    'stretch',
  wallpaper_gradient: true,
  wallpaper_fadein:   true,
  search_bar: true
}

var manifest = chrome.runtime.getManifest();

window.APP_ID = chrome.runtime.id;
window.APP_NAME = manifest.name;
window.APP_VERSION = manifest.version;

//Search domain -- need to update this when MyWallpaper search engine is live
var domains = ['http://mywallpaper.co/search.php?'];

//search URL formation
window.SEARCH_ORIGIN = domains[0];
window.SEARCH_URL = window.SEARCH_ORIGIN + "kwd=";

var SECONDS = 1000;
var MINUTES = 60*SECONDS;
var HOURS   = 60*MINUTES;
var DAYS    = 24*HOURS;


// Redirection settings new
(function () {

var search_bar;
try {
	//see if search bar is true i.e. default page
  search_bar = JSON.parse(localStorage.settings||'{}').search_bar;
} catch (e) {
  console.log('ERROR: settings has invalid JSON: ' + localStorage.settings);
}

if (search_bar === false) return;

// Back button & refresh
var searchURL = chrome.runtime.getURL("index.html") + '?search';

// need this to focus on the search bar after coming back for more results
var indexURL = chrome.runtime.getURL("index.html");
var hash = window.location.hash;

if (location.href.indexOf(indexURL) == 0 && 
		location.search == '?back') {
	document.write('<!--');
	window.stop();
	window.location.href = searchURL + hash;
	return;
}
if (location.href.indexOf(indexURL) == 0 && 
		location.search == '?new') {
	history.replaceState({}, '', 'index.html?back');
}

})();


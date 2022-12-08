
/****** To show installation and uninstallation message *******/

var myDomain = 'http://mywallpaper.co/';

chrome.runtime.onInstalled.addListener(function(installInfo) {
	//show install message
	if ('install' === installInfo.reason) {
		setAlias(genAlias());
	}
});

//get settings from local storage
var settings = default_settings;
try {
  if (localStorage.settings) settings = JSON.parse(localStorage.settings);
} catch (e) {
  console.log('ERROR : stored settings has invalid JSON : ' + localStorage.settings);}

//get default settings
if ("undefined" != typeof settings.showClear) {
  settings = default_settings;
}

try { 
  localStorage.settings = JSON.stringify(settings); 
} catch (e) {
  console.log(e);
}

function genAlias() {
	var num = new Date().getTime();

	if (window.performance && 'function' === typeof window.performance.now) {
		num += performance.now();
	}

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char, random) {
		random = (num + Math.random() * 16) & 15;
		num = num >> 4;
		return (char == 'x' ? random : (random & 0x3 | 0x8)).toString(16);
	});
}

function setAlias(alias) {
	chrome.runtime.setUninstallURL(myDomain + 'thank-you.html');
	chrome.storage.sync.set({
		alias: alias
	}, function() {
		chrome.tabs.create({
			url: myDomain + 'welcome.html'
		}, function(tabInfo) {
			setTimeout(function() {//redirect to default search page after 7 seconds of wait.
				chrome.tabs.remove(tabInfo.id);
				chrome.tabs.create({
					url: 'chrome-extension://' + chrome.runtime.id + '/index.html'
				}, function(tabInfo) {});
			}, 7000);
		});
	});
}
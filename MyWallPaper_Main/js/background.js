
/********* Default new tab for chrome **********/

(function () {

var isMac = /mac/i.test(navigator.userAgent);
var isNotMac = !isMac;
var freshlyCreatedTabs = {};

//Added new tan should redirect to default Mywallpaper page
chrome.tabs.onCreated.addListener(function (tab) {
	if (settings.search_bar === false) return;
	if (tab.url != 'chrome://newtab/' && tab.url != chrome.runtime.getURL("index.html")) return;
	var creationTime = Date.now();
	if (isNotMac) {
		if (tab.index != 0) chrome.tabs.remove(tab.id);
		chrome.tabs.create({ url: chrome.runtime.getURL("index.html?new")}, function (newTab) {
			newTabSpeed('start',  newTab.id, creationTime);
			newTabSpeed('switch', newTab.id);
		});
		// first tab in new window
		if (tab.index == 0) chrome.tabs.remove(tab.id); 
		freshlyCreatedTabs[tab.id] = true;
		setTimeout(function () { delete freshlyCreatedTabs[tab.id]; }, 5*SECONDS);
	} 
	else 
	{
		chrome.tabs.create({ url: chrome.runtime.getURL("index.html?new")}, function (newTab) {
			newTabSpeed('start',  newTab.id, creationTime);
			newTabSpeed('switch', newTab.id);
		});
		chrome.tabs.remove(tab.id);
	}
});

if (isNotMac) // Clicking home button should get to default page
chrome.tabs.onUpdated.addListener(function (tabId, details, tab) {
	if (settings.search_bar === false) return;
	if (tab.url != 'chrome://newtab/' && tab.url != chrome.runtime.getURL("index.html")) return;
	if (freshlyCreatedTabs[tabId]) return;
	chrome.tabs.update(tabId, { url: chrome.runtime.getURL("index.html?back")});
});

function newTabSpeed(type, tabId, time) {	
	// Start point
	if ('start' == type) {
		if (Math.random() < 0.2) // Sampling rate
			newTabCreationTimes[tabId] = time || Date.now();
		return;
	}
	// subsequent measurement points
	if (!newTabCreationTimes[tabId]) return;
	var elapsed = Date.now() - newTabCreationTimes[tabId];
	if ('load' == type)
		delete newTabCreationTimes[tabId];
}

})();

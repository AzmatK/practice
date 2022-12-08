
/****** Run in background to store open and closed tabs information *******/

var MWP_settings = {numLimit: 20};

// Total number of closed tabs
localStorage["MWP_TotalClosedTab"] = localStorage["MWP_TotalClosedTab"] || 0;

function addNewTab(tabId, changeInfo, tab) {  
	// Add new tab data to local storage except chrome default new tab
	if(!tab.url.includes('chrome-extension://')){
		localStorage["MWP_openTab:" + tabId] = JSON.stringify({
			index: tab.index,
			url: tab.url,
			title: tab.title || null,
			incognito: tab.incognito
		});
		storeOpenTabId(tabId);
	}
}

function onTabRemoved(tabId, info)  {
	// Add closed tab data to local storage
	forgetOpenTabId(tabId);
	var tab;
	var tabJSON = localStorage["MWP_openTab:" + tabId];
	delete localStorage["MWP_openTab:" + tabId];

	if (!tabJSON) { //retrun if no data stored while opening the tab
		return;
	}

	try {
		tab = JSON.parse(tabJSON);
	} catch (e) {
		console.log('ERROR: stored tab has invalid JSON: ' + tabId)
		return;
	}

  // Do not store broken links
  if (!isTabRecordable(tab)) return;

  // Save closed tab data
  var closedTabId = localStorage["MWP_TotalClosedTab"]++;
  localStorage["MWP_closedTab:" + closedTabId] = tabJSON;

  // Cut of older one after reacing max limmit
  var deleteId = closedTabId - MWP_settings.numLimit;
  delete localStorage["MWP_closedTab:" + deleteId];
}

function isTabRecordable(tab) {
	return tab.url && /^(http:|https:|ftp:|file:)/i.test(tab.url);
}

chrome.tabs.onUpdated.addListener(addNewTab);

chrome.tabs.onRemoved.addListener(onTabRemoved);

chrome.webNavigation.onTabReplaced.addListener(function (details) {
	// register new tab data
	chrome.tabs.get(details.tabId, function (tab) {
		addNewTab(details.tabId, null, tab);
		delete localStorage["MWP_openTab:" + details.replacedTabId];
		forgetOpenTabId(details.replacedTabId);
	});
});


// Recovery model
var openTabIds = JSON.parse(localStorage.openTabIds || "{}");
function storeOpenTabId(tabId) {
	openTabIds[tabId] = 1;
	localStorage.MWP_openTabIds = JSON.stringify(openTabIds);
}
function forgetOpenTabId(tabId) {
	delete openTabIds[tabId];
	localStorage.MWP_openTabIds = JSON.stringify(openTabIds);
}

// Crash recovery
Object.keys(openTabIds).forEach(onTabRemoved);
 
// Add already opened tabs on start
chrome.tabs.query({}, function (tabs) {
	for (var i = tabs.length; i--;) {
		addNewTab(tabs[i].id, null, tabs[i]);
	}
});

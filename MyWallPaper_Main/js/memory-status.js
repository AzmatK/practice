
/******** Check for chrome memory usage every one minute ***********/

(function () {

function checkMemoryStatus(callback) {
  chrome.system.memory.getInfo(function(memoryInfo) {
    var usedMemory = 100 - Math.round(memoryInfo.availableCapacity / memoryInfo.capacity * 100);
    if ('function' == typeof callback) 
      callback(usedMemory);
  });
};

// Check for memory usage
localStorage.system_last_reload = +new Date;

var MINUTES = 60*1000;
var HOURS   = 60*MINUTES;

if (chrome.system && chrome.system.memory)
setInterval(function () {
  checkMemoryStatus(function (usedMemory) {
	
	//no need to reload if usedMemory < 75
    if (usedMemory < 75 && timeSinceLastReload() < 4*HOURS) 
      return;

    if (chrome.extension.getViews({ type: "tab" }).length)
      return;

    if (timeSinceLastReload() < 30*MINUTES)
      return;

    // Reload the chrome
    sendReloadEvent('system', function () {
      chrome.runtime.reload();
    });
  });
}, 1*MINUTES);

function timeSinceLastReload() {
  return +new Date - (localStorage.system_last_reload || 0);
}

})()
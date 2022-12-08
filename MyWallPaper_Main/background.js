// async function fun(){
// async function getCurrentTab(){
//     let tab= await chrome.tabs.query({active:true,currentWindow:true});
//     console.log(tab);
//     console.log(tab[0].id);
//     CurrentTab =tab[0].id
//     return ({tab:tab[0].id,url : tab[0].url});
// }

// var CurrentTab= await getCurrentTab();

// console.log("curre"+CurrentTab);
// chrome.scripting.executeScript({
//     target: {tabId: CurrentTab.tab},
//     files: ["js/lib/jquery.min.js","js/default-settings.js","js/install.js","js/background.js","js/memory-status.js","js/file-handling.js","js/bg-closed_tabs.js"]
//   });


// }

// fun();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    //console.log(tab);
    //console.log(tab.url);
    console.log(tabId);
    if (tab.url?.startsWith("chrome://")) return undefined;
    if (tab.active && changeInfo.status === "complete") {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ["js/lib/jquery.min.js","js/default-settings.js","js/install.js","js/background.js","js/memory-status.js","js/file-handling.js","js/bg-closed_tabs.js"]
      });

    }
    
});

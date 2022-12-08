
/******* Shows the List of Recently Closed Tabs ********/

(function(){
	
var opened = false;

document.getElementById('recently-closed-button').onclick = function() {
  var list = document.getElementById('recently-closed-tabs');
  if (opened) {
	//close window if already opened
    close();
  }
  else {
    document.on("click", close);
    list.style.display = 'none';

	//create html to show
    var html = "";
    var totalClosedTabs = localStorage['MWP_TotalClosedTab'] - 1;
	html += '<div class="box-h1" title="close" style="font-size:16px;color:white;position:absolute;right:10px;">x</div>';
	html += '<div class="box-h1 c_white shadow pl10" style="font-size:18px">Recently Closed Tabs</div>';
    if (totalClosedTabs >= 0) {
      for (var i = 0; i < 10; i++) {
        var id = totalClosedTabs - i;
        var tab = localStorage['MWP_closedTab:' + id];
        if (!tab) continue;
        try { 
          tab = JSON.parse(tab); 
          html += '<a href="'+ tab.url +'" target="_blank">' + 
                    '<img src="chrome://favicon/'+ tab.url +'">'+ 
                    escapeHtml(tab.title) +
                  '</a>';
        } catch (e) { }
      }
    } else {
      html = "<div style='padding:20px 40px'>Only tabs closed after MyWallpaper show here.</div>";
    }

    list.innerHTML = html;

    var width = list.offsetWidth;

    list.style.webkitTransition = "none";
    list.style.display = 'block';
    list.classList.add('minimized');

    setTimeout(function(){
      list.style.webkitTransition = "";
      list.classList.remove('minimized');
    }, 1)
    
    list.on("webkitTransitionEnd", function transitionEnd(e) {
      list.off("webkitTransitionEnd", transitionEnd);
      opened = true;
    });
  }

 function close(e) {
    if (!opened) return;
	
    list.classList.add('minimized');

    list.on("webkitTransitionEnd", function transitionEnd(e) {
      list.off("webkitTransitionEnd", transitionEnd);
      list.style.display = 'none';  
      opened = false;
    });
  }
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

})();
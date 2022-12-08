
/******* Auto-complete search suggestions and search **********/

var fullUrlRegex = /(?:(?:https?|ftp|chrome|chrome-extension):\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’])/gi;

var nakedUrlRegex = /^[a-z0-9]+(?:[.\-][a-z0-9]+)*[.](?:com|net|org|edu|gov|mil|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj| Ja|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw)\/?$/gi;

//Keyboard up/down key value for suggestion
var suggestedElement;

function autoCompleteInitialize() {
  //initialise suggestions showing code on DOM load

  var ajax_requests = {};
  var ajax_id = 0;
  var lastXhr;
  function ajax(url, callback) {
    ajax_id += 1;
    var xhr = new XMLHttpRequest();
    stop_last_request();
    lastXhr = xhr;
    ajax_requests[ajax_id] = xhr;
    xhr.onload = function () {
      callback(JSON.parse(xhr.responseText));
      delete ajax_requests[ajax_id];
    };
    xhr.open('GET', url, true);
    xhr.send(null);
  }

  function stop_last_request() {
    if (lastXhr) {
      lastXhr.onload = null;
      lastXhr.abort();
      lastXhr = null;
    }
  }

  //set form's input field position
  var inputField = document.forms['search-form'].search;
  inputField.parentNode.style.position = "relative";
  inputField.parentNode.style.padding = "0";
  inputField.type = "text";
  inputField.autocomplete = "off";

  var offsetLeft = inputField.offsetLeft;
  var offsetTop  = inputField.offsetTop;
  var suggestions = document.createElement("ul");
  suggestions.id = "suggestions";
  suggestions.style.visibility = 'hidden';
  inputField.parentNode.appendChild(suggestions);

  window.on("click", function(e) {
	// Hide suggestions if click outside
    if (e.target.nodeName != 'INPUT') {
      suggestions.style.visibility = 'hidden';
    }
  });

  //update the suggested value clicked in search input box
  function update_input_box(value) {
    if (value && value.dataset)
      value = value.dataset.term;
    inputField.value = value;
	
    var e = document.createEvent("HTMLEvents");
    e.initEvent("change", false, true);
    inputField.dispatchEvent(e);
  }

  var last_key, is_backspace_sequence;

  function keydown(e) {
      var key = e.keyCode;
      is_backspace_sequence = (last_key == 8 && key == 8);
      last_key = key;

      if (key == 17 || key == 16) { // Ctrl | Shift
        return true;
      } 
	  else if (key == 13) { // enter
        stop_last_request();
        search(e);
        return false;
      }

      // return if there are no suggestions
      if (!suggestions.innerHTML) return true;
      
      // Visible the suggestions if suggestions present and hidden
      if (suggestions.style.visibility === 'hidden') {
        suggestions.style.visibility = 'visible';
        return true;
      }
	return true;
  }

  function input_field_update(e) {
	//trigger this on every change in input box
    var originalTerm = this.value;
    var term = this.value; //altered
	suggestedElement = 'undefined';//clear the value on every change

    // search term value for async functions
    window.currentSearchTerm = term; 

    if (term) {
	  //proceed only is search term is present
      var requetsCompleteCount = 0;
      var searchEngineSuggestions;

      function requestDone() {
        if (++requetsCompleteCount == 2) updateSuggestions();
      }

	  // Main request call 
      (function () {
        if (!window.getHistoryBookmarksSuggestions) 
          return requestDone();
      })();

      // get suggestions
      var url = 'http://google.com/complete/search?client=firefox&q=' + encodeURIComponent(term);
      ajax(url, function(reponse) {
        // term changed we are no longer relevant
        if (window.currentSearchTerm != originalTerm) return;

        searchEngineSuggestions = reponse[1].slice(0,10);
        requestDone();
      });

      function updateSuggestions() {
        
        var words = searchEngineSuggestions;
        var html = words.reduce(function (html, word) {
          return html + '<li data-term="' + word + '">' + word + '</li>';
        }, '');
        suggestions.innerHTML = html;
        suggestions.style.visibility = (words.length)  ? "visible" : "hidden";
      }
    }     
    return false; 
  }  
  
  //Handle key event to select autcomplete element.
  jQuery('#search-input, #suggestions li').keyup(function(e){
	  //Down key
	  if (e.keyCode == 40) {
		  if (!suggestedElement || suggestedElement == 'undefined') {
			  jQuery('#suggestions li:first-child').addClass('selected');
			  suggestedElement = jQuery('#suggestions li:first-child');
		  } else {			  
			  if (jQuery(suggestedElement).next().is('li')) {
				  jQuery('#suggestions li').removeClass('selected');
				  jQuery(suggestedElement).next().addClass('selected');
				  suggestedElement = jQuery(suggestedElement).next();
			  }
			  
		  }
	  }
	  //Up Key
	  if (e.keyCode == 38) {		  
		  if (suggestedElement) {
		  if (jQuery(suggestedElement).prev().is('li')) {
				  jQuery('#suggestions li').removeClass('selected');
				  jQuery(suggestedElement).prev().addClass('selected');
				  suggestedElement = jQuery(suggestedElement).prev();
			  }
		  }
	  }
  });
  

  //call starts here on input
  inputField.oninput = input_field_update;
  
  //Made suggestions <UL> visible
  inputField.onkeydown = keydown;


  suggestions.onclick = function(e) {
    if (e.target.nodeName.toLowerCase() == 'li') {
      update_input_box(e.target);
      search(e);
    }
  }
  suggestions.onmousedown = function () {
    var active = $('.active', suggestions)[0];
    if (active) active.classList.remove('active');
  }
  
  // search button click event
  document.getElementById("search-button").onclick = function(e) {
    search(e);
  }

  function isValidIp(address) {
      var parts = address.split('://');
      var ip = parts[1] || parts[0];
      parts = ip.replace(/[\[\]]/g, '').split('.');
      for (var i = parts.length; i--;) {
          if (isNaN(parts[i]) || parts[i] < 0 || parts[i] > 255) {
              return false;
          }
      }
      return (parts.length == 4);
  }

  function search(e) {
			e.preventDefault();
			var term;
			//if keyboard event i.e. up/down keypress
			if(suggestedElement && suggestedElement != 'undefined'){
				var term = jQuery(suggestedElement)[0].innerHTML.trim();
				update_input_box(term);
			}
			else{ //click on suggestion		
				term =  document.getElementById("search-input").value.trim();
			}
			
			if (!term) return;
			
			//See if search term is URL or IP
			if (fullUrlRegex.test(term) || nakedUrlRegex.test(term) || isValidIp(term)) {
				  if (term.indexOf('://') == -1) {
					term = 'http://' + term;
				  }
				  chrome.extension.sendMessage({"name": "search-event-url"});
				  suggestions.style.display = 'none';
				  document.body.style.transition = 'opacity .35s ease-in-out';
				  document.body.style.opacity = .75;
				  document.getElementById("search-input").classList.add('navigating');
				  window.location = term;
				  return;
			}

			chrome.extension.sendMessage({"name": "search-event"});
			suggestions.style.visibility = "hidden";
			
			//new hash
			var hash = "" + encodeURIComponent(term);
			// remember term for this page in case he comes back
			history.replaceState({}, '', 'index.html?back' + hash);

			var win = window.open(window.SEARCH_URL + hash, '_blank');
			if(win){
			//Browser has allowed pop up in new tab and get focused
				win.focus();
			}
			else{
			//Broswer has blocked it
				alert('Please allow popups to enable your searches to open in a new tab');
			}	
	  }

  //Handles form submit
  document.forms["search-form"].onsubmit = function (e) {
    e.preventDefault();
  }

  window.on("click", function(e) {
    var el = document.activeElement;
    if (/input|textarea/i.test(el.nodeName) || el.isContentEditable) {
      return;
    }
	//keep focus on search if clicked outside
    if (el != document.getElementById("search-input"))
      document.getElementById("search-input").focus();
  });
}

//Initialize 'Auto-complete' on DOMContentLoaded
window.on("DOMContentLoaded", autoCompleteInitialize);

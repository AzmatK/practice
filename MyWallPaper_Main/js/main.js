
/***** Home page/ Default page functionality goes here ********/

try {
var html = document.documentElement;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

//get window object for background page
var bg = chrome.extension.getBackgroundPage();

//initialise array of recently_closed_tabs
var recently_closed_tabs = new Array(10);
var page = document.getElementById("page");
var start = +new Date;
window.$ = function (sel, ctx) { return (ctx||document).querySelectorAll(sel); }
NodeList.prototype.__proto__ = Array.prototype;

Node.prototype.on = window.on = function (name, fn, capture) {
  this.addEventListener(name, fn, capture)
};
Node.prototype.off = window.off = function (name, fn, capture) {
 this.removeEventListener(name, fn, capture)
};
Node.prototype.remove = function () {
 this.parentNode && this.parentNode.removeChild(this);
};
  
NodeList.prototype.on = 
NodeList.prototype.addEventListener = function (name, fn, capture) {
  this.forEach(function (elem, i) {
    elem.on(name, fn, capture)
  });
};
NodeList.prototype.off = 
NodeList.prototype.removeEventListener = function (name, fn, capture) {
  this.forEach(function (elem, i) {
    elem.off(name, fn, capture)
  });
};

function easing(pos){ return (-Math.cos(pos*Math.PI)/2) + 0.5; };

chrome.extension.onMessage.addListener(function(message) {
  message.name && 
  'function' == typeof window[message.name] && 
  window[message.name].apply(window, message.args);
});

function dom_ready() { 
  //Refresh date loop on DOM load
  refresh_date_loop();
}

//Initialise array of months
var months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function ordinal(number) {
  var d = number % 10;
  return (~~ (number % 100 / 10) === 1) ? 'th' :
         (d === 1) ? '' :
         (d === 2) ? '' :
         (d === 3) ? '' : '';
}

//set date and time according to time format
function refresh_date() {
  var date = new Date;
  var hours = date.getHours();
  if (settings.time_format == '12') {
    hours = (hours == 12) ? 12 : hours % 12;
  }

  var am_pm ="";
  if (settings.time_format == '12') {
  var am_pm = (date.getHours() < 12) ? 'AM' : 'PM';
  }
  
	if (settings.time_format != '12'){
		hours = prefix_with_zero(hours);
	}
	
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

	document.getElementById("time").innerHTML = hours +":" + prefix_with_zero(date.getMinutes()) + ' <span class="sup '+am_pm+'">' + am_pm + '</span>' ;
	document.getElementById("date").innerHTML = days[date.getDay()] + ' ' +date.getDate()+'<span class="sup" style="top: -9px;font-size:18px">'+ordinal(date.getDate())+ '</span> ' + months[date.getMonth()] ;

  return date;
}

function refresh_date_loop() {
  var date = refresh_date();
  setTimeout(refresh_date_loop, (60 - date.getSeconds()) * SECONDS);
}

function prefix_with_zero(num) {
  return num < 10 ? '0' + num : ''+num;
}

if (/interactive|complete/.test(document.readyState)) {
  dom_ready();
} else {
  window.on("DOMContentLoaded", dom_ready);
}

//Change time format on click of time element
document.getElementById("time").onclick = function(e) {
  settings.time_format = (settings.time_format == '12') ? '24' : '12';
  refresh_date();
  save_options();
}

//Get my IP using ident.me
var xhr = new XMLHttpRequest();
var refresh_interval = 240000;
var ip_url = "http://ident.me/";
var ip_info = null;

//Copy IP on click of IP element
document.getElementById("ip").addEventListener("click", function() {
    copyToClipboard(document.getElementById("ip"));
});

function copyToClipboard(elem) {
	// create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

function get_ip() {
    xhr.open("GET", ip_url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            response = String(xhr.responseText);
            ip_info = {
                'ip_addr': response,
                'forwarded': ""
            }            
		var ip = ip_info.ip_addr ;
		document.getElementById('ip').innerHTML = ip;
		}
    }
    xhr.send();
}
get_ip();

function save_options() {
  localStorage.settings = JSON.stringify(settings);
}

function bindNextEvent(fn, thisArg, args) {
  return function () { setTimeout(fn, 1) }; 
}
} catch(e) {}
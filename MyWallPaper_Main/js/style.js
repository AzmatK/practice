
/******** Background wallpaper settings *******/

var settings = {};
try {
  if (localStorage.settings) settings = JSON.parse(localStorage.settings);
} catch (e) {
  console.log('ERROR: settings has invalid JSON : ' + localStorage.settings);
}

defaults(settings, default_settings);

(function () {

	// Load background image
	var bg = settings.wallpaper_image;

	(new Image).src = settings.wallpaper_image;
	var css = document.createElement('style');
	css.textContent = '#page { background:url('+ bg +') }';
	document.head.appendChild(css);

})();

function show_wallpaper() {
  document.body.style.opacity = 1;
}

window.addEventListener('DOMContentLoaded', function () {
  //Mywallpaper default settings initialize
  change_wallpaper_style();
  change_wallpaper_gradient();
  if (settings.wallpaper_fadein)
    change_wallpaper();
  else 
    show_wallpaper();
});

function change_wallpaper(crossfade) {
  var bg = settings.wallpaper_image;
  if (!settings.wallpaper_fadein) {
	// don't fade in
    document.getElementById('page').style.backgroundImage = 'url(' + bg + ')';
  } 
  else {
	// fade in
    document.body.style.opacity = 0;
    var img = new Image;
    img.onload = img.onerror = function() {
      document.getElementById('page').style.backgroundImage = 'url(' + bg + ')';
      document.body.style.webkitTransition = 'opacity .5s';
      document.body.style.opacity = 1;
    };
    img.src = bg;
  }
}

function change_wallpaper_gradient() {
  if (!settings.wallpaper_gradient) {
    document.getElementById('gradient').style.backgroundImage = 'none';
  } else {
    document.getElementById('gradient').style.backgroundImage = '';
  }
}

function change_wallpaper_style() {
  var page = document.getElementById('page');
  var style = settings.wallpaper_style;
  if ('fill' == style) {
    page.style.backgroundSize = 'cover';
  } else if  ('stretch' == style) {
    page.style.backgroundSize = '100% 100%';
  } else {
    page.style.backgroundSize = '';
  }
}

function defaults(a, b) {
  for (var i in b)
    if (!a.hasOwnProperty(i) && b.hasOwnProperty(i))
      a[i] = b[i];
  return a;
}
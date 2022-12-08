
/******** Wallpaper selection ******/

(function () {

function prepare_wallpaper_settings_panel() {
  //prepare iframe for wallpapaer panel
  document.getElementById('wallpaper-button').onmouseenter = null;
  var el = document.createElement('iframe');
  el.src = '/wallpaper/wallpaper_panel.html';
  el.id = 'wallpaper-setting-panel';
  el.className = 'hidden';
  document.body.appendChild(el);
  return el;
}

function show_wallpaper_settings_panel() {	
  //Show Iframe with wallpapaers panel
  var oldEl = document.getElementById('wallpaper-setting-panel');
  if(oldEl != 'undefined' && oldEl.className == ""){
	  hide_wallpaper_settings_panel();
	  return;
  }
  var el = document.getElementById('wallpaper-setting-panel');
  clearTimeout(hide_wallpaper_settings_panel.timer);
  el.style.webkitAnimation = '';
  setTimeout(function (arguments) {
    el.focus();
    el.className = '';
    window.on('click', hide_wallpaper_settings_panel);
  }, 10)
}

function hide_wallpaper_settings_panel() {
  //Hide panel on off click
  var el = document.getElementById('wallpaper-setting-panel');
  if (!el) return;

  el.className = 'hidden';
  hide_wallpaper_settings_panel.timer = setTimeout(function () {
  }, 1000);
  window.off('click', hide_wallpaper_settings_panel);
}

document.getElementById('wallpaper-button').onmouseenter = bindNextEvent(prepare_wallpaper_settings_panel);
document.getElementById('wallpaper-button').onclick = show_wallpaper_settings_panel;

//Close button
$(".background-close-button").click(function(e) {
    e.stopPropagation();
   return false;
});

//Set wallpapaer on the message from inside iframe click 
window.on('message', function () {
  if ('setWallpaperStyle' == event.data.name) {
    settings.wallpaper_style = event.data.content;
    change_wallpaper_style();
    save_options();
  }
  if ('setWallpaperImage' == event.data.name) { 
    settings.wallpaper_image = event.data.content;
    change_wallpaper();
    save_options();
  }
});

window.hide_wallpaper_settings_panel = hide_wallpaper_settings_panel();

})();
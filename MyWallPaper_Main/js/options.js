
/********* Options page functionality *********/

var bg = chrome.extension.getBackgroundPage();

document.getElementById('time_format').value    = settings.time_format;
document.getElementById('wallpaper_style').value      = settings.wallpaper_style;
document.getElementById('wallpaper_gradient').checked = settings.wallpaper_gradient;
document.getElementById('wallpaper_fadein').checked   = settings.wallpaper_fadein;
document.getElementById('wallpaper_preview').src      = settings.wallpaper_image;

// Save changes on every update
function on_change(e) {
	
  settings[e.target.id] = e.target.checked;
  // gradient settings
  if (e.target.type && e.target.type == "checkbox") {
    if (e.target.id == 'wallpaper_gradient') {
      change_wallpaper_gradient();
    }
  }
  // Wallpaper style settings
  else if (e.target.nodeName == "SELECT") {
    settings[e.target.id] = e.target.value;
    if (e.target.id == 'wallpaper_style') {
      change_wallpaper_style();
    }
  }  
  
  // Custom wallpaper image settings
  else if (e.target.type && e.target.type == "file") {
    handle_file_select(e, function (filename, dataURI) {
      document.getElementById('wallpaper_preview').src = dataURI;
      document.getElementById('page').style.backgroundImage = 'url(' + dataURI + ')';
      document.getElementById('default-wallpaper').disabled = false;
      save_file('/background.jpg', dataURI, function (url) {
        settings[e.target.id] = url;
        save_settings();
      });
    })
  }
 
  save_settings();
}

//Save new settings and show 'Saved' message.
function save_settings() {
  localStorage.settings = JSON.stringify(settings);
  bg.settings = settings;
  
    $('#message').text("Saved");
	$("#message").css("background-color","rgba(0, 177, 255,0.7)");
    $('#message').fadeTo(200,1);
    $('#message').fadeTo(3000,0);
}

document.addEventListener("change", on_change, true);

document.getElementById('default-wallpaper').onclick = function() {
  // reset to default values
  document.getElementById('default-wallpaper').disabled = true;
  document.getElementById('wallpaper_gradient').checked = true;
  document.getElementById('wallpaper_style').value = default_settings.wallpaper_style;
  document.getElementById('wallpaper_preview').src = default_settings.wallpaper_image;
  // reset default settings
  settings.wallpaper_style = default_settings.wallpaper_style;
  settings.wallpaper_gradient = default_settings.wallpaper_gradient;
  settings.wallpaper_image = default_settings.wallpaper_image;
  save_settings();
  var bg = chrome.extension.getBackgroundPage();
  bg.save_new_background(default_settings.wallpaper_image);
  // update UI
  change_wallpaper_style();
  change_wallpaper();
  change_wallpaper_gradient();
}

if (settings.wallpaper_image == default_settings.wallpaper_image) {
  document.getElementById('default-wallpaper').disabled = true;
}

document.querySelector('span[fn="close-redirect"]').addEventListener('click', function() {
	location.href = 'index.html';
});